import {
  useEffect,
  useState,
} from "react";

import { getImagePredictionHistory } from "../api/imagePredictionApi";

export default function RecentImagePredictions() {
  const [predictions, setPredictions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadPredictions() {
      try {
        const response =
          await getImagePredictionHistory();

        setPredictions(
          (
            response.predictions ||
            []
          ).slice(0, 3)
        );
      } catch (error) {
        console.error(
          "Dashboard prediction history error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadPredictions();
  }, []);

  return (
    <section className="dashboard-card">
      <h2>
        Recent Image Predictions
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : predictions.length === 0 ? (
        <p>
          No image predictions yet.
        </p>
      ) : (
        <div>
          {predictions.map(
            (prediction) => (
              <article
                key={prediction.id}
                className="recent-prediction-item"
              >
                <div>
                  <strong>
                    {
                      prediction.displayName
                    }
                  </strong>

                  <span>
                    {new Date(
                      prediction.createdAt
                    ).toLocaleDateString()}
                  </span>
                </div>

                <strong>
                  {Number(
                    prediction.confidence
                  ).toFixed(2)}
                  %
                </strong>
              </article>
            )
          )}
        </div>
      )}
    </section>
  );
}