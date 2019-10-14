const greetings = [
  "Have a good day.",
  "Have a great day.",
  "Good day.",
  "Good morning.",
  "Have a lovely day.",
  "You have a good day.",
  "Have a wonderful day.",
  "You have a nice day.",
  "Good day to you.",
  "Have a pleasant day.",
  "Good day to you.",
  "Lovely day.",
  "Have a good time",
]


const show = () => {
  return greetings[Math.floor(Math.random()*greetings.length)];
}

const Greetings = {show}

export default Greetings;
