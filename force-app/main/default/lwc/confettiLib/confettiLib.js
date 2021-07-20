const basicCannon = (particleCount, spread, originY) => {
    if (particleCount == undefined) { particleCount = 100; }
    if (spread == undefined) { spread = 70; }
    if (originY == undefined) { originY = 0.6; }
    confetti({        
        particleCount: particleCount,
        spread: spread, 
        origin: {
            y: originY
        }
    });
}

const randomFun = (min, max) => {
    return Math.random() * (max - min) + min;
}

const randomCannon = () => {
    confetti({
        angle: randomFun(55,125),
        spread: randomFun(50, 70),
        particleCount: randomFun(50, 100),
        origin: {
            y: 0.6
        }
    });
}

const fireworks = (duration) => {
    if (duration == undefined) { duration = 5; } // 5 seconds
    var end = Date.now() + duration * 1000;
    let interval = setInterval(function() {
        if (Date.now() > end) {
            return clearInterval(interval);
        }

        confetti({
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            origin: {
                x: Math.random(),
                y: Math.random() - 0.2
            }
        });
    }, 200);

}

export { basicCannon, randomCannon, fireworks };