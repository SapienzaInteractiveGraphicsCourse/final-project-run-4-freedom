class InputManager {
  constructor() {
    this.keys = {};
    const keyMap = new Map();

    // In regular functions the this keyword represented the object that called the function,
    // which could be the window, the document, a button or whatever (undefined if used in a function in strict mode).
    // With arrow functions the this keyword always represents the object that defined the arrow function.

    // down denotes if the key is currently pressed
    // justPressed denotes if the key has been pressed in this frame

    // Add key to the keyMap
    const addKey = (keyCode, name) => {
        this.keys[name] = { down: false, justPressed: false };
        keyMap.set(keyCode, name);
      };

    // Set key status when an event occurs
    const setKeyStatusFromKeyCode = (keyCode, pressed) => {
        const keyName = keyMap.get(keyCode);
        if (!keyName) {
          return;
        }
        setKeyStatus(keyName, pressed);
      };

    // Set key status
    const setKeyStatus = (keyName, pressed) => {
        const keyState = this.keys[keyName];
        keyState.justPressed = pressed && !keyState.down;
        keyState.down = pressed;
      };

    // Arrows
    addKey(37, 'left');
    addKey(39, 'right');
    addKey(38, 'up');
    addKey(40, 'down');

    // WASD
    addKey(87, 'W');
    addKey(65, 'A');
    addKey(83, 'S');
    addKey(68, 'D');

    // Pause
    addKey(32, 'spacebar');
    addKey(80, 'P');

    window.addEventListener('keydown', (e) => {
      setKeyStatusFromKeyCode(e.keyCode, true);
    });
    window.addEventListener('keyup', (e) => {
      setKeyStatusFromKeyCode(e.keyCode, false);
    });
  }

  update() {
    for (const keyState of Object.values(this.keys)) {
      if (keyState.justPressed)
        keyState.justPressed = false;
    }
  }

  leftAction() {
      return this.keys.left.down || this.keys.A.down;
  }

  rightAction() {
      return this.keys.right.down || this.keys.D.down;
  }

  forwardAction() {
    return this.keys.up.down || this.keys.W.down;
  }

  backAction() {
    return this.keys.down.down || this.keys.S.down;
  }

  pauseAction() {
    return this.keys.spacebar.justPressed || this.keys.P.justPressed;
  }

}

export {InputManager}
