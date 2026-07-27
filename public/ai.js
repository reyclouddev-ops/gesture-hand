// =====================================
// ReyCloud AI Voice
// =====================================

const subtitle = document.getElementById("subtitle");
const voiceStatus = document.getElementById("voice");

const speechMap = {

    Open_Palm: [
        "Halo semuanya.",
        "Halo teman teman.",
        "Selamat datang di ReyCloud.",
        "Apa kabar semuanya.",
        "Senang bertemu dengan kalian."
    ],

    Thumb_Up: [
        "Mantap.",
        "Keren sekali.",
        "Sip.",
        "Lanjutkan.",
        "Kerja bagus."
    ],

    Victory: [
        "Peace.",
        "Semangat terus.",
        "Kalian luar biasa.",
        "Tetap semangat ya."
    ],

    Closed_Fist: [
        "Ayo kita mulai.",
        "Saatnya bekerja.",
        "Semangat.",
        "Yuk mulai."
    ],

    ILoveYou: [
        "Love you.",
        "Terima kasih sudah mendukung ReyCloud.",
        "Semoga harimu menyenangkan."
    ],

    Pointing_Up: [
        "Saya sedang mendengarkan.",
        "Silakan lanjutkan.",
        "Ada yang bisa saya bantu."
    ]

};

// =====================================

function randomText(list){

    return list[
        Math.floor(Math.random()*list.length)
    ];

}

// =====================================

function speak(text){

    if(speechSynthesis.speaking){
        speechSynthesis.cancel();
    }

    subtitle.textContent=text;

    voiceStatus.textContent="Berbicara...";

    const msg=
    new SpeechSynthesisUtterance(text);

    msg.lang="id-ID";

    msg.rate=1;

    msg.pitch=1;

    msg.volume=1;

    const voices=speechSynthesis.getVoices();

    const indonesia=
    voices.find(v=>v.lang.startsWith("id"));

    if(indonesia){
        msg.voice=indonesia;
    }

    msg.onend=()=>{

        voiceStatus.textContent=
        "Menunggu Gesture...";

    };

    speechSynthesis.speak(msg);

}

// =====================================

function speakGesture(gesture){

    const list=speechMap[gesture];

    if(!list) return;

    speak(randomText(list));

}

// =====================================

speechSynthesis.onvoiceschanged=()=>{

    speechSynthesis.getVoices();

};
