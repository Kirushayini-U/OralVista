import io
import json
import logging
from pathlib import Path
from typing import Any

import cv2
import joblib
import numpy as np
import pandas as pd
import shap
import tensorflow as tf
import torch

from transformers import (
    CLIPModel,
    CLIPProcessor,
)

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from PIL import Image, UnidentifiedImageError


# =========================================================
# Basic configuration
# =========================================================

BASE_DIR = Path(__file__).resolve().parent

# Existing CNN image model
MODEL_PATH = BASE_DIR / "oralvista_image_model_fixed.keras"
CLASS_NAMES_PATH = BASE_DIR / "class_names.json"

# Random Forest symptom model
SYMPTOM_MODEL_PATH = (
    BASE_DIR
    / "symptom-model"
    / "oralvista_random_forest.joblib"
)

SYMPTOM_METADATA_PATH = (
    BASE_DIR
    / "symptom-model"
    / "oralvista_rf_metadata.json"
)

IMAGE_SIZE = (224, 224)
MAX_FILE_SIZE = 5 * 1024 * 1024

# Pretrained zero-shot semantic validator
CLIP_MODEL_NAME = "openai/clip-vit-base-patch32"

# Start reasonably strict.
# Adjust only after testing a representative set of oral/non-oral images.
ORAL_IMAGE_THRESHOLD = 0.65

ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
}

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("oralvista-ai")


# =========================================================
# Validate required files
# =========================================================

if not MODEL_PATH.exists():
    raise RuntimeError(
        f"Image model file was not found: {MODEL_PATH}"
    )

if not CLASS_NAMES_PATH.exists():
    raise RuntimeError(
        f"Class names file was not found: {CLASS_NAMES_PATH}"
    )

if not SYMPTOM_MODEL_PATH.exists():
    raise RuntimeError(
        f"Symptom model file was not found: {SYMPTOM_MODEL_PATH}"
    )

if not SYMPTOM_METADATA_PATH.exists():
    raise RuntimeError(
        f"Symptom metadata file was not found: "
        f"{SYMPTOM_METADATA_PATH}"
    )


# =========================================================
# Load image class names
# =========================================================

with CLASS_NAMES_PATH.open(
    "r",
    encoding="utf-8",
) as file:
    class_names: list[str] = json.load(file)

if not isinstance(class_names, list) or not class_names:
    raise RuntimeError(
        "class_names.json must contain a non-empty list."
    )


# =========================================================
# Load symptom metadata
# =========================================================

with SYMPTOM_METADATA_PATH.open(
    "r",
    encoding="utf-8",
) as file:
    symptom_metadata: dict[str, Any] = json.load(file)

SYMPTOM_FEATURES = symptom_metadata.get(
    "features",
    [],
)

SYMPTOM_CLASSES = symptom_metadata.get(
    "classes",
    [],
)

SYMPTOM_MODEL_NAME = symptom_metadata.get(
    "model_name",
    "OralVista Random Forest",
)

if not isinstance(SYMPTOM_FEATURES, list):
    raise RuntimeError(
        "Symptom metadata 'features' must be a list."
    )

if len(SYMPTOM_FEATURES) != 14:
    raise RuntimeError(
        "Symptom model must contain exactly 14 features."
    )

if not isinstance(SYMPTOM_CLASSES, list):
    raise RuntimeError(
        "Symptom metadata 'classes' must be a list."
    )

if len(SYMPTOM_CLASSES) != 6:
    raise RuntimeError(
        "Symptom model must contain exactly 6 classes."
    )


# =========================================================
# Load CNN image model
# =========================================================

model = tf.keras.models.load_model(
    MODEL_PATH,
    compile=False,
)

logger.info(
    "OralVista image model loaded successfully."
)

# =========================================================
# Load pretrained CLIP semantic image validator
# =========================================================

logger.info(
    "Loading CLIP oral-image validator: %s",
    CLIP_MODEL_NAME,
)

clip_processor = CLIPProcessor.from_pretrained(
    CLIP_MODEL_NAME
)

clip_model = CLIPModel.from_pretrained(
    CLIP_MODEL_NAME
)

clip_model.eval()

logger.info(
    "CLIP oral-image validator loaded successfully."
)

logger.info(
    "Image classes: %s",
    class_names,
)


# =========================================================
# Load Random Forest symptom model
# =========================================================

symptom_model = joblib.load(
    SYMPTOM_MODEL_PATH
)

logger.info(
    "OralVista symptom model loaded successfully."
)

logger.info(
    "Symptom model: %s",
    SYMPTOM_MODEL_NAME,
)

logger.info(
    "Symptom features: %s",
    SYMPTOM_FEATURES,
)

logger.info(
    "Symptom classes: %s",
    list(symptom_model.classes_),
)


# =========================================================
# Initialize SHAP
# =========================================================

symptom_explainer = shap.TreeExplainer(
    symptom_model
)

logger.info(
    "SHAP TreeExplainer initialized successfully."
)


# =========================================================
# Validate symptom model
# =========================================================

if getattr(
    symptom_model,
    "n_features_in_",
    None,
) != len(SYMPTOM_FEATURES):

    raise RuntimeError(
        "Loaded symptom model feature count does not "
        "match the metadata."
    )

loaded_symptom_classes = list(
    symptom_model.classes_
)

if loaded_symptom_classes != SYMPTOM_CLASSES:
    raise RuntimeError(
        "Loaded symptom model classes do not match "
        "the metadata."
    )

stored_feature_names = list(
    getattr(
        symptom_model,
        "feature_names_in_",
        [],
    )
)

if (
    stored_feature_names
    and stored_feature_names != SYMPTOM_FEATURES
):
    raise RuntimeError(
        "Loaded symptom model feature names do not "
        "match the metadata."
    )


# =========================================================
# FastAPI application
# =========================================================

app = FastAPI(
    title="OralVista AI Prediction API",
    version="1.3.0",
    description=(
        "OralVista AI service containing CNN image "
        "classification and Random Forest symptom-based "
        "oral health prediction with SHAP explanations."
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=[
        "GET",
        "POST",
    ],
    allow_headers=["*"],
)


# =========================================================
# Medical disclaimer
# =========================================================

DISCLAIMER = (
    "This AI result is for preliminary screening and educational "
    "purposes only. It is not a confirmed medical diagnosis. "
    "Please consult a qualified dental professional."
)


# =========================================================
# Image prediction recommendations
# =========================================================

RECOMMENDATIONS: dict[str, list[str]] = {

    "calculus": [
        "Arrange a dental examination for professional assessment.",
        "Professional scaling may be required to remove hardened deposits.",
        "Brush twice daily using fluoride toothpaste.",
        "Clean between the teeth using floss or interdental brushes.",
    ],

    "gingivitis": [
        "Arrange a dental examination if gum bleeding or swelling continues.",
        "Brush gently twice daily along the gum line.",
        "Use floss or interdental brushes every day.",
        "Avoid smoking and maintain regular dental check-ups.",
    ],

    "hypodontia": [
        "Consult a qualified dentist for a complete dental examination.",
        "A dental X-ray may be required to confirm missing tooth development.",
        "Discuss orthodontic or restorative treatment options with a dentist.",
        "Maintain good oral hygiene around the remaining teeth.",
    ],
}


# =========================================================
# Symptom prediction recommendations
# =========================================================

SYMPTOM_RECOMMENDATIONS: dict[str, list[str]] = {

    "Dental Caries": [
        "Arrange a dental examination if tooth pain or sensitivity continues.",
        "Brush twice daily using fluoride toothpaste.",
        "Reduce frequent intake of sugary foods and drinks.",
        "Clean between the teeth using floss or interdental brushes.",
    ],

    "Gingivitis": [
        "Arrange a dental examination if gum bleeding or swelling continues.",
        "Brush gently twice daily along the gum line.",
        "Use floss or interdental brushes every day.",
        "Avoid smoking and maintain regular dental check-ups.",
    ],

    "Healthy": [
        "Continue brushing twice daily using fluoride toothpaste.",
        "Clean between the teeth every day.",
        "Maintain a balanced diet and limit frequent sugar intake.",
        "Continue regular preventive dental check-ups.",
    ],

    "Oral Thrush": [
        "Consult a qualified dental or medical professional for assessment.",
        "Maintain good oral hygiene and keep the mouth clean.",
        "Drink adequate water if you experience dry mouth.",
        "Avoid self-medicating without professional advice.",
    ],

    "Oral Ulcer": [
        "Avoid spicy, acidic or very hot foods while the ulcer is healing.",
        "Maintain gentle oral hygiene around the affected area.",
        "Drink adequate water and avoid tobacco products.",
        "Seek professional assessment if the ulcer persists or repeatedly returns.",
    ],

    "Periodontitis": [
        "Arrange a dental examination for professional periodontal assessment.",
        "Maintain careful brushing along the gum line.",
        "Clean between the teeth daily.",
        "Avoid smoking and seek prompt professional care if symptoms worsen.",
    ],
}


# =========================================================
# Friendly feature names for SHAP display
# =========================================================

FEATURE_DISPLAY_NAMES = {
    "tooth_pain": "Tooth Pain",
    "gum_bleeding": "Gum Bleeding",
    "bad_breath": "Bad Breath",
    "mouth_ulcer": "Mouth Ulcer",
    "tooth_sensitivity": "Tooth Sensitivity",
    "swelling": "Swelling",
    "white_spots": "White Spots",
    "dry_mouth": "Dry Mouth",
    "sugar_intake_high": "High Sugar Intake",
    "smoking": "Smoking",
    "betel_chewing": "Betel Chewing",
    "brushing_frequency_low": "Low Brushing Frequency",
    "age": "Age",
    "water_intake_low": "Low Water Intake",
}


# =========================================================
# Symptom request validation
# =========================================================

class SymptomPredictionRequest(BaseModel):

    tooth_pain: int = Field(
        ge=0,
        le=1,
    )

    gum_bleeding: int = Field(
        ge=0,
        le=1,
    )

    bad_breath: int = Field(
        ge=0,
        le=1,
    )

    mouth_ulcer: int = Field(
        ge=0,
        le=1,
    )

    tooth_sensitivity: int = Field(
        ge=0,
        le=1,
    )

    swelling: int = Field(
        ge=0,
        le=1,
    )

    white_spots: int = Field(
        ge=0,
        le=1,
    )

    dry_mouth: int = Field(
        ge=0,
        le=1,
    )

    sugar_intake_high: int = Field(
        ge=0,
        le=1,
    )

    smoking: int = Field(
        ge=0,
        le=1,
    )

    betel_chewing: int = Field(
        ge=0,
        le=1,
    )

    brushing_frequency_low: int = Field(
        ge=0,
        le=1,
    )

    age: int = Field(
        ge=1,
        le=120,
    )

    water_intake_low: int = Field(
        ge=0,
        le=1,
    )


# =========================================================
# Basic image-content / quality validation
# =========================================================

def validate_uploaded_image_basic(
    image_bytes: bytes,
) -> tuple[bool, str, dict[str, float]]:
    """
    Basic no-training validation layer.

    IMPORTANT:
    This does NOT prove that an image contains teeth.
    It rejects obviously unsuitable images such as:
    - very small images
    - very dark / overexposed images
    - heavily blurred images
    - images with almost no visual detail

    A trained oral-vs-non-oral validator is still the
    recommended solution for reliable out-of-domain rejection.
    """

    try:
        image = Image.open(
            io.BytesIO(image_bytes)
        ).convert("RGB")

        image_np = np.asarray(
            image,
            dtype=np.uint8,
        )

        height, width = image_np.shape[:2]

        # -------------------------------------------------
        # 1. Minimum dimensions
        # -------------------------------------------------

        if width < 160 or height < 160:
            return (
                False,
                (
                    "The image resolution is too low. "
                    "Please upload a clearer close-up oral image."
                ),
                {
                    "width": float(width),
                    "height": float(height),
                },
            )

        gray = cv2.cvtColor(
            image_np,
            cv2.COLOR_RGB2GRAY,
        )

        # -------------------------------------------------
        # 2. Brightness / exposure
        # -------------------------------------------------

        brightness = float(
            np.mean(gray)
        )

        if brightness < 35:
            return (
                False,
                (
                    "The image is too dark. "
                    "Please take the oral photo in better lighting."
                ),
                {
                    "brightness": brightness,
                },
            )

        if brightness > 245:
            return (
                False,
                (
                    "The image is too bright or overexposed. "
                    "Please upload a clearer oral image."
                ),
                {
                    "brightness": brightness,
                },
            )

        # -------------------------------------------------
        # 3. Blur check
        # -------------------------------------------------

        blur_score = float(
            cv2.Laplacian(
                gray,
                cv2.CV_64F,
            ).var()
        )

        if blur_score < 28:
            return (
                False,
                (
                    "The image appears too blurry. "
                    "Please upload a clear, focused photo of the teeth."
                ),
                {
                    "brightness": brightness,
                    "blurScore": blur_score,
                },
            )

        # -------------------------------------------------
        # 4. Visual-detail check
        # -------------------------------------------------

        edges = cv2.Canny(
            gray,
            50,
            150,
        )

        edge_ratio = float(
            np.count_nonzero(edges)
            / edges.size
        )

        if edge_ratio < 0.008:
            return (
                False,
                (
                    "The image does not contain enough visible detail. "
                    "Please upload a close-up oral image showing "
                    "the teeth and gum line."
                ),
                {
                    "brightness": brightness,
                    "blurScore": blur_score,
                    "edgeRatio": edge_ratio,
                },
            )

        # -------------------------------------------------
        # 5. Extremely flat / low-contrast check
        # -------------------------------------------------

        contrast = float(
            np.std(gray)
        )

        if contrast < 12:
            return (
                False,
                (
                    "The image has very low contrast. "
                    "Please upload a clearer oral photo."
                ),
                {
                    "brightness": brightness,
                    "blurScore": blur_score,
                    "edgeRatio": edge_ratio,
                    "contrast": contrast,
                },
            )

        return (
            True,
            "Image passed basic quality checks.",
            {
                "width": float(width),
                "height": float(height),
                "brightness": round(
                    brightness,
                    2,
                ),
                "blurScore": round(
                    blur_score,
                    2,
                ),
                "edgeRatio": round(
                    edge_ratio,
                    4,
                ),
                "contrast": round(
                    contrast,
                    2,
                ),
            },
        )

    except UnidentifiedImageError as error:
        raise HTTPException(
            status_code=400,
            detail=(
                "The uploaded file is not a valid image."
            ),
        ) from error

    except Exception as error:
        logger.exception(
            "Basic image validation failed."
        )

        raise HTTPException(
            status_code=400,
            detail=(
                "The uploaded image could not be validated."
            ),
        ) from error


# =========================================================
# Pretrained CLIP oral / non-oral semantic validation
# =========================================================

def validate_oral_image_clip(
    image_bytes: bytes,
) -> tuple[bool, float, dict[str, float]]:
    """
    Zero-shot semantic validation using pretrained CLIP.

    This is an additional input-domain safety layer.
    It does not modify or retrain the existing dental CNN.

    The validator compares the uploaded image against
    multiple oral and non-oral text descriptions.
    """

    try:
        image = Image.open(
            io.BytesIO(image_bytes)
        ).convert("RGB")

        # Multiple prompts make the comparison more robust
        # than a single oral vs single non-oral sentence.
        oral_prompts = [
            (
                "a close-up clinical photograph of "
                "human teeth and gums inside the mouth"
            ),
            (
                "a dental photograph showing human teeth"
            ),
            (
                "an intraoral photograph of teeth and gum tissue"
            ),
            (
                "a close-up photograph of a human mouth "
                "with visible teeth"
            ),
        ]

        non_oral_prompts = [
            "a photograph of a tree or landscape",
            "a photograph of an animal",
            "a photograph of food",
            "a photograph of a car or vehicle",
            "a photograph of a building or room",
            "a photograph of a document or screen",
            "a photograph of a person without a dental close-up",
            "a photograph of an everyday non-dental object",
        ]

        prompts = (
            oral_prompts
            + non_oral_prompts
        )

        inputs = clip_processor(
            text=prompts,
            images=image,
            return_tensors="pt",
            padding=True,
        )

        with torch.inference_mode():
            outputs = clip_model(
                **inputs
            )

            prompt_probabilities = (
                outputs.logits_per_image
                .softmax(dim=1)[0]
                .cpu()
                .numpy()
            )

        oral_count = len(
            oral_prompts
        )

        # Aggregate probability mass for each group.
        oral_score = float(
            np.sum(
                prompt_probabilities[
                    :oral_count
                ]
            )
        )

        non_oral_score = float(
            np.sum(
                prompt_probabilities[
                    oral_count:
                ]
            )
        )

        total_score = (
            oral_score
            + non_oral_score
        )

        if total_score <= 0:
            raise RuntimeError(
                "CLIP produced an invalid score."
            )

        oral_probability = (
            oral_score
            / total_score
        )

        non_oral_probability = (
            non_oral_score
            / total_score
        )

        metrics = {
            "oralProbability": round(
                oral_probability * 100,
                2,
            ),
            "nonOralProbability": round(
                non_oral_probability * 100,
                2,
            ),
        }

        logger.info(
            "CLIP oral-content validation: %s",
            metrics,
        )

        is_oral = (
            oral_probability
            >= ORAL_IMAGE_THRESHOLD
            and oral_probability
            > non_oral_probability
        )

        return (
            is_oral,
            oral_probability,
            metrics,
        )

    except UnidentifiedImageError as error:
        raise HTTPException(
            status_code=400,
            detail=(
                "The uploaded file is not a valid image."
            ),
        ) from error

    except HTTPException:
        raise

    except Exception as error:
        logger.exception(
            "CLIP oral-image validation failed."
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "The oral-image content validation "
                "could not be completed."
            ),
        ) from error


# =========================================================
# Image helper
# =========================================================

def preprocess_image(
    image_bytes: bytes,
) -> np.ndarray:

    try:

        image = Image.open(
            io.BytesIO(image_bytes)
        )

        image = image.convert(
            "RGB"
        )

        image = image.resize(
            IMAGE_SIZE
        )

        image_array = np.asarray(
            image,
            dtype=np.float32,
        )

        image_array = np.expand_dims(
            image_array,
            axis=0,
        )

        return image_array

    except UnidentifiedImageError as error:

        raise HTTPException(
            status_code=400,
            detail=(
                "The uploaded file is not a valid image."
            ),
        ) from error


# =========================================================
# Create image prediction response
# =========================================================

def create_prediction_response(
    probabilities: np.ndarray,
) -> dict[str, Any]:

    predicted_index = int(
        np.argmax(probabilities)
    )

    predicted_class = class_names[
        predicted_index
    ]

    confidence = float(
        probabilities[predicted_index]
        * 100
    )

    all_probabilities = {

        class_names[index]: round(
            float(probability * 100),
            2,
        )

        for index, probability
        in enumerate(probabilities)
    }

    normalized_class = (
        predicted_class.lower()
    )

    return {

        "success": True,

        "prediction": normalized_class,

        "displayName": (
            predicted_class.title()
        ),

        "confidence": round(
            confidence,
            2,
        ),

        "probabilities": (
            all_probabilities
        ),

        "recommendations": (
            RECOMMENDATIONS.get(
                normalized_class,
                [
                    "Consult a qualified dental professional "
                    "for further evaluation."
                ],
            )
        ),

        "disclaimer": DISCLAIMER,

        "model": (
            "EfficientNetB0 Transfer Learning"
        ),
    }


# =========================================================
# Confidence level
# =========================================================

def get_confidence_level(
    confidence: float,
) -> str:

    if confidence < 40:
        return "Low"

    if confidence < 70:
        return "Moderate"

    return "High"


# =========================================================
# Generate SHAP explanation
# =========================================================

def generate_shap_explanation(
    input_frame: pd.DataFrame,
    prediction: str,
) -> list[dict[str, Any]]:

    try:

        # Find predicted class position
        predicted_class_index = list(
            symptom_model.classes_
        ).index(prediction)

        # SHAP output confirmed in your environment:
        # (1 patient, 14 features, 6 classes)
        shap_values = (
            symptom_explainer.shap_values(
                input_frame
            )
        )

        shap_array = np.asarray(
            shap_values
        )

        if shap_array.ndim != 3:

            raise RuntimeError(
                f"Unexpected SHAP dimensions: "
                f"{shap_array.shape}"
            )

        # Select:
        # patient 0
        # all 14 features
        # predicted disease class
        predicted_class_shap = (
            shap_array[
                0,
                :,
                predicted_class_index,
            ]
        )

        explanations = []

        for index, feature in enumerate(
            SYMPTOM_FEATURES
        ):

            feature_value = (
                input_frame.iloc[0][feature]
            )

            shap_value = float(
                predicted_class_shap[index]
            )

            if shap_value > 0:
                direction = "Supports prediction"

            elif shap_value < 0:
                direction = "Reduces prediction"

            else:
                direction = "Neutral"

            explanations.append(
                {
                    "feature": feature,

                    "displayName": (
                        FEATURE_DISPLAY_NAMES.get(
                            feature,
                            feature,
                        )
                    ),

                    "value": (
                        int(feature_value)
                        if float(feature_value).is_integer()
                        else float(feature_value)
                    ),

                    "shapValue": round(
                        shap_value,
                        6,
                    ),

                    "impact": direction,

                    "importance": round(
                        abs(shap_value),
                        6,
                    ),
                }
            )

        # Largest influence first
        explanations.sort(
            key=lambda item: item["importance"],
            reverse=True,
        )

        # Return main five factors
        return explanations[:5]

    except Exception:

        logger.exception(
            "SHAP explanation generation failed."
        )

        return []


# =========================================================
# Create symptom prediction response
# =========================================================

def create_symptom_prediction_response(
    prediction: str,
    probabilities: np.ndarray,
    shap_explanation: list[dict[str, Any]],
) -> dict[str, Any]:

    class_probabilities = {

        class_name: round(
            float(probability * 100),
            2,
        )

        for class_name, probability
        in zip(
            symptom_model.classes_,
            probabilities,
        )
    }

    confidence = (
        class_probabilities[
            prediction
        ]
    )

    confidence_level = (
        get_confidence_level(
            confidence
        )
    )

    return {

        "success": True,

        "prediction": prediction,

        "confidence": confidence,

        "confidenceLevel": (
            confidence_level
        ),

        "probabilities": (
            class_probabilities
        ),

        "shapExplanation": (
            shap_explanation
        ),

        "recommendations": (
            SYMPTOM_RECOMMENDATIONS.get(
                prediction,
                [
                    "Consult a qualified dental professional "
                    "for further evaluation."
                ],
            )
        ),

        "disclaimer": DISCLAIMER,

        "model": {
            "name": SYMPTOM_MODEL_NAME,
            "type": "RandomForestClassifier",
            "version": "1.0",
            "explainability": "SHAP TreeExplainer",
        },
    }


# =========================================================
# Root
# =========================================================

@app.get("/")
def root() -> dict[str, Any]:

    return {

        "service": (
            "OralVista AI Prediction API"
        ),

        "status": "running",

        "imageValidation": {
            "qualityValidation": "OpenCV",
            "semanticValidation": "CLIP zero-shot",
            "clipModel": CLIP_MODEL_NAME,
            "oralThreshold": ORAL_IMAGE_THRESHOLD,
        },

        "imageModel": {
            "loaded": True,
            "classes": class_names,
        },

        "symptomModel": {
            "loaded": True,
            "modelName": (
                SYMPTOM_MODEL_NAME
            ),
            "numberOfFeatures": len(
                SYMPTOM_FEATURES
            ),
            "classes": (
                SYMPTOM_CLASSES
            ),
            "shapEnabled": True,
        },
    }


# =========================================================
# Health
# =========================================================

@app.get("/health")
def health() -> dict[str, Any]:

    return {

        "status": "healthy",

        "imageValidation": {
            "qualityValidatorLoaded": True,
            "semanticValidatorLoaded": True,
            "oralThreshold": ORAL_IMAGE_THRESHOLD,
        },

        "imageModel": {
            "loaded": True,
            "numberOfClasses": len(
                class_names
            ),
        },

        "symptomModel": {
            "loaded": True,
            "numberOfFeatures": len(
                SYMPTOM_FEATURES
            ),
            "numberOfClasses": len(
                SYMPTOM_CLASSES
            ),
            "shapEnabled": True,
        },
    }


# =========================================================
# Existing CNN image prediction
# DO NOT REMOVE
# =========================================================

@app.post("/predict")
async def predict_image(
    file: UploadFile = File(...),
) -> dict[str, Any]:

    if (
        file.content_type
        not in ALLOWED_CONTENT_TYPES
    ):

        raise HTTPException(
            status_code=415,
            detail=(
                "Unsupported image type. "
                "Upload JPG, JPEG, PNG or WEBP."
            ),
        )

    image_bytes = await file.read()

    if not image_bytes:

        raise HTTPException(
            status_code=400,
            detail=(
                "The uploaded image is empty."
            ),
        )

    if len(image_bytes) > MAX_FILE_SIZE:

        raise HTTPException(
            status_code=413,
            detail=(
                "Image exceeds the maximum "
                "size of 5 MB."
            ),
        )

    try:

        # -------------------------------------------------
        # STEP 1: BASIC IMAGE QUALITY VALIDATION
        # -------------------------------------------------

        (
            is_valid_image,
            validation_message,
            validation_metrics,
        ) = validate_uploaded_image_basic(
            image_bytes
        )

        if not is_valid_image:
            raise HTTPException(
                status_code=422,
                detail=validation_message,
            )

        logger.info(
            "Image quality validation passed: %s",
            validation_metrics,
        )

        # -------------------------------------------------
        # STEP 2: CLIP SEMANTIC ORAL-CONTENT VALIDATION
        # -------------------------------------------------

        (
            is_oral_image,
            oral_probability,
            oral_validation_metrics,
        ) = validate_oral_image_clip(
            image_bytes
        )

        if not is_oral_image:
            logger.warning(
                "Rejected non-oral image. Metrics: %s",
                oral_validation_metrics,
            )

            raise HTTPException(
                status_code=422,
                detail=(
                    "This image does not appear to contain "
                    "a clear close-up view of human teeth "
                    "and gums. Please upload a suitable "
                    "oral image."
                ),
            )

        logger.info(
            "Oral-content validation passed: %s",
            oral_validation_metrics,
        )

        # -------------------------------------------------
        # STEP 3: PREPROCESS FOR EXISTING CNN
        # -------------------------------------------------

        image_array = (
            preprocess_image(
                image_bytes
            )
        )

        # -------------------------------------------------
        # STEP 4: EXISTING 3-CLASS DENTAL CNN PREDICTION
        # -------------------------------------------------

        prediction = model.predict(
            image_array,
            verbose=0,
        )[0]

        response = (
            create_prediction_response(
                prediction
            )
        )

        response["imageQualityValidation"] = {
            "passed": True,
            "message": validation_message,
            "metrics": validation_metrics,
        }

        response["oralImageValidation"] = {
            "passed": True,
            "method": "CLIP zero-shot semantic validation",
            "model": CLIP_MODEL_NAME,
            "oralProbability": round(
                oral_probability * 100,
                2,
            ),
            "threshold": round(
                ORAL_IMAGE_THRESHOLD * 100,
                2,
            ),
            "metrics": oral_validation_metrics,
        }

        return response

    except HTTPException:
        raise

    except Exception as error:

        logger.exception(
            "Image prediction failed."
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "The image prediction could "
                "not be completed."
            ),
        ) from error

    finally:

        await file.close()


# =========================================================
# Random Forest symptom prediction with SHAP
# =========================================================

@app.post("/predict-symptoms")
def predict_symptoms(
    request: SymptomPredictionRequest,
) -> dict[str, Any]:

    try:

        input_data = (
            request.model_dump()
        )

        # Force exact model feature order
        ordered_input = {

            feature: input_data[feature]

            for feature
            in SYMPTOM_FEATURES
        }

        input_frame = pd.DataFrame(
            [ordered_input],
            columns=SYMPTOM_FEATURES,
        )

        # Prediction
        prediction = str(
            symptom_model.predict(
                input_frame
            )[0]
        )

        # Probabilities
        probabilities = (
            symptom_model.predict_proba(
                input_frame
            )[0]
        )

        # SHAP explanation
        shap_explanation = (
            generate_shap_explanation(
                input_frame,
                prediction,
            )
        )

        return (
            create_symptom_prediction_response(
                prediction,
                probabilities,
                shap_explanation,
            )
        )

    except Exception as error:

        logger.exception(
            "Symptom prediction failed."
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "The symptom prediction could "
                "not be completed."
            ),
        ) from error