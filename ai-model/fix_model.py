import json
import zipfile
from pathlib import Path


SOURCE_MODEL = Path("oralvista_image_model.keras")
FIXED_MODEL = Path("oralvista_image_model_fixed.keras")


def remove_quantization_config(value):
    """Remove unsupported quantization metadata recursively."""

    if isinstance(value, dict):
        cleaned = {}

        for key, item in value.items():
            if key == "quantization_config":
                continue

            cleaned[key] = remove_quantization_config(item)

        return cleaned

    if isinstance(value, list):
        return [
            remove_quantization_config(item)
            for item in value
        ]

    return value


if not SOURCE_MODEL.exists():
    raise FileNotFoundError(
        f"Model not found: {SOURCE_MODEL.resolve()}"
    )


with zipfile.ZipFile(SOURCE_MODEL, "r") as source_zip:
    with zipfile.ZipFile(
        FIXED_MODEL,
        "w",
        compression=zipfile.ZIP_DEFLATED,
    ) as fixed_zip:

        for file_info in source_zip.infolist():
            file_data = source_zip.read(file_info.filename)

            if file_info.filename == "config.json":
                config = json.loads(
                    file_data.decode("utf-8")
                )

                config = remove_quantization_config(config)

                file_data = json.dumps(
                    config,
                    ensure_ascii=False,
                ).encode("utf-8")

            fixed_zip.writestr(
                file_info,
                file_data,
            )


print("Compatible model created successfully:")
print(FIXED_MODEL.resolve())