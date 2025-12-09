import cv2
import numpy as np
import mediapipe as mp
import base64

mp_face = mp.solutions.face_mesh

def decode_base64_image(base64_string):
    """Converts Base64 string to OpenCV image"""
    img_data = base64.b64decode(base64_string.split(',')[-1])
    np_arr = np.frombuffer(img_data, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    return frame


def calculate_attention_score(image_base64, study_mode="Screen Work"):
    """
    Receives a base64-encoded frame and computes an attention score
    using simple facial and head pose metrics from MediaPipe.
    """

    # Decode image
    frame = decode_base64_image(image_base64)
    if frame is None:
        return {"error": "Invalid frame"}

    # Initialize mediapipe
    with mp_face.FaceMesh(static_image_mode=True, max_num_faces=1, refine_landmarks=True) as face_mesh:
        results = face_mesh.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

        if not results.multi_face_landmarks:
            return {"attention_score": 0, "face_detected": False}

        # Example feature calculations
        face_detected = True
        eyes_open = np.random.uniform(0.7, 1.0)  # Placeholder
        gaze_centered = np.random.uniform(0.6, 1.0)  # Placeholder
        head_stable = np.random.uniform(0.7, 1.0)  # Placeholder

        # Define weights based on study mode
        weights = {
            "Screen Work": {"face": 0.3, "eyes": 0.25, "gaze": 0.25, "head": 0.15},
            "Writing": {"face": 0.4, "eyes": 0.35, "gaze": 0.1, "head": 0.1},
            "Reading": {"face": 0.35, "eyes": 0.3, "gaze": 0.15, "head": 0.15}
        }

        w = weights.get(study_mode, weights["Screen Work"])

        # Weighted attention score (for now using random placeholders)
        score = (
            w["face"] * 1.0
            + w["eyes"] * eyes_open
            + w["gaze"] * gaze_centered
            + w["head"] * head_stable
        ) * 100

        return {
            "attention_score": round(score, 2),
            "face_detected": face_detected,
            "eyes_open": round(eyes_open, 2),
            "gaze_centered": round(gaze_centered, 2),
            "head_stable": round(head_stable, 2),
            "mode": study_mode
        }
