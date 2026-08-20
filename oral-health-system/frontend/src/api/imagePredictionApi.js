const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken")
  );
}

async function readResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "The request could not be completed."
    );
  }

  return data;
}

/*
 * Upload one oral image.
 */
export async function predictOralImage(
  imageFile
) {
  const token = getToken();

  if (!token) {
    throw new Error(
      "Please sign in before using image prediction."
    );
  }

  const formData = new FormData();

  /*
   * This field must be called "image"
   * because the backend uses:
   * imageUpload.single("image")
   */
  formData.append("image", imageFile);

  const response = await fetch(
    `${API_BASE_URL}/image-predictions/predict`,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
      },

      body: formData,
    }
  );

  return readResponse(response);
}

/*
 * Get the logged-in patient's history.
 */
export async function getImagePredictionHistory() {
  const token = getToken();

  if (!token) {
    throw new Error(
      "Please sign in to view prediction history."
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/image-predictions/history`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return readResponse(response);
}

/*
 * Delete one history record.
 */
export async function deleteImagePrediction(
  predictionId
) {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/image-predictions/history/${predictionId}`,
    {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return readResponse(response);
}