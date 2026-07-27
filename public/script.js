const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const loading = document.getElementById("loading");
const app = document.getElementById("app");

const gestureText = document.getElementById("gesture");
const scoreText = document.getElementById("score");
const cameraText = document.getElementById("cameraText");
const cameraDot = document.getElementById("cameraDot");

let gestureRecognizer;
let runningMode = "VIDEO";
let lastVideoTime = -1;

// =============================
// Inisialisasi MediaPipe
// =============================

async function setupAI() {

    const vision =
    await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    gestureRecognizer =
    await GestureRecognizer.createFromOptions(
        vision,
        {
            baseOptions: {
                modelAssetPath:
                "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task"
            },

            runningMode: runningMode,

            numHands: 2
        }
    );

}

// =============================
// Kamera
// =============================

async function setupCamera() {

    try {

        const stream =
        await navigator.mediaDevices.getUserMedia({

            video: {
                facingMode: "user",
                width: 1280,
                height: 720
            },

            audio: false

        });

        video.srcObject = stream;

        await video.play();

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        cameraDot.style.background = "#00ff66";
        cameraText.textContent = "Kamera Aktif";

    }

    catch (err) {

        console.error(err);

        cameraDot.style.background = "red";

        cameraText.textContent =
        "Kamera Gagal";

        alert("Tidak bisa mengakses kamera.");

    }

}

// =============================
// Loading
// =============================

async function init() {

    await setupAI();

    await setupCamera();

    loading.style.display = "none";

    app.style.display = "block";

    renderLoop();

}

init();
// =============================
// Deteksi Gesture
// =============================

function processResult(results) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!results.gestures.length) {

        gestureText.textContent = "Tidak Ada";

        scoreText.textContent = "0%";

        return;

    }

    const gesture = results.gestures[0][0];

    gestureText.textContent = gesture.categoryName;

    scoreText.textContent =
        (gesture.score * 100).toFixed(1) + "%";

    // Kirim ke AI Voice
    if (typeof processGesture === "function") {
        processGesture(gesture.categoryName);
    }

}
// =============================
// Render Loop
// =============================

function renderLoop() {

    if (video.readyState >= 2) {

        if (video.currentTime !== lastVideoTime) {

            lastVideoTime = video.currentTime;

            const results =
                gestureRecognizer.recognizeForVideo(
                    video,
                    performance.now()
                );

            processResult(results);

        }

    }

    requestAnimationFrame(renderLoop);

}
// =============================
// Cooldown Gesture
// =============================

let lastGesture = "";
let lastSpeakTime = 0;

const SPEAK_DELAY = 2500;

// =============================
// Kirim ke AI
// =============================

function processGesture(gesture) {

    const now = Date.now();

    if (
        gesture === lastGesture &&
        now - lastSpeakTime < SPEAK_DELAY
    ) {
        return;
    }

    lastGesture = gesture;
    lastSpeakTime = now;

    if (typeof speakGesture === "function") {
        speakGesture(gesture);
    }

}

// =============================
// Resize Canvas
// =============================

window.addEventListener("resize", () => {

    canvas.width = video.videoWidth;

    canvas.height = video.videoHeight;

});

// =============================
// Kamera Berhenti
// =============================

window.addEventListener("beforeunload", () => {

    if (!video.srcObject) return;

    video.srcObject
        .getTracks()
        .forEach(track => track.stop());

});
