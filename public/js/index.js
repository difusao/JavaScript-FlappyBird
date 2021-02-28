const cvs = document.getElementById("bird");
const ctx = cvs.getContext("2d");
const DEGREE = Math.PI / 180;
const sprite = new Image();
const SCORE_S = new Audio();
const FLAP = new Audio();
const HIT = new Audio();
const SWOOSHING = new Audio();
const DIE = new Audio();

sprite.src = "images/sprite.png";
SCORE_S.src = "audio/sfx_point.wav";
FLAP.src = "audio/sfx_flap.wav";
HIT.src = "audio/sfx_hit.wav";
SWOOSHING.src = "audio/sfx_swooshing.wav";
DIE.src = "audio/sfx_die.wav";

var frames = 0;