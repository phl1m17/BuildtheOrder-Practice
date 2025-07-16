import { useEffect } from "react";
import Phaser from "phaser";
import burgers from "../data/items.json";

const ingredientMap = {
  ingredient00: "ketchup",
  ingredient01: "mustard",
  ingredient02: "mac sauce",
  ingredient03: "mayo",
  ingredient04: "habanero sauce",
  ingredient05: "tartar sauce",
  ingredient06: "ranch",
  ingredient07: "chipotle sauce",
  ingredient08: "thai sauce",
  ingredient09: "plain buns",
  ingredient10: "bigmac buns",
  ingredient11: "quarter pounder buns",
  ingredient12: "potato buns",
  ingredient13: "small tortilla shell",
  ingredient14: "big tortilla shell",
  ingredient15: "10:1 patty",
  ingredient16: "4:1 patty",
  ingredient17: "jr chicken",
  ingredient18: "chicken",
  ingredient19: "crispy chicken",
  ingredient20: "filet",
  ingredient21: "bacon",
  ingredient22: "shredded lettuce",
  ingredient23: "leaf lettuce",
  ingredient24: "slivered onions",
  ingredient25: "pickle",
  ingredient26: "cucumber",
  ingredient27: "tomato",
  ingredient28: "cheese",
  ingredient29: "shredded cheese",
};

class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
  }

  preload() {
    for (let i = 0; i < 30; i++) {
      const index = i.toString().padStart(2, "0");
      const key = `ingredient${index}`;
      this.load.image(key, `assets/ingredients${index}.png`);
    }
  }

  create() {
    this.add.text(220, 150, "🍟 Build the Order 🍔", {
      fontSize: "40px",
      color: "#d93b3b",
      fontFamily: "Arial",
    });

    const startButton = this.add
      .text(330, 280, "▶ Start", {
        fontSize: "36px",
        backgroundColor: "#ffd966",
        color: "#000",
        padding: { left: 20, right: 20, top: 10, bottom: 10 },
        borderRadius: 10,
        fontFamily: "Arial",
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () =>
        startButton.setStyle({ backgroundColor: "#ffcc00" })
      )
      .on("pointerout", () =>
        startButton.setStyle({ backgroundColor: "#ffd966" })
      )
      .on("pointerdown", () => {
        this.scene.start("GameScene");
      });
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    const backButton = this.add
      .text(0, 0, "← Main Menu", {
        fontSize: "24px",
        backgroundColor: "#ddd",
        color: "#000",
        padding: { left: 15, right: 15, top: 8, bottom: 8 },
        fontFamily: "Arial",
        borderRadius: 8,
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => backButton.setStyle({ backgroundColor: "#ccc" }))
      .on("pointerout", () => backButton.setStyle({ backgroundColor: "#ddd" }))
      .on("pointerdown", () => {
        this.scene.start("StartScene");
      });

    const cols = 6;
    const spacingX = 120;
    const spacingY = 80;
    const startX = 100;
    const startY = 232;

    this.selectedIngredients = [];
    this.selectedTextGroup = this.add.group();

    const updateSelectedListDisplay = () => {
      this.selectedTextGroup.clear(true, true);
      const maxWidth = 700;
      let x = 50;
      let y = 100;
      const paddingX = 10;
      const paddingY = 6;
      const lineHeight = 30;

      this.selectedIngredients.forEach((ing, i) => {
        const txt = this.add.text(0, 0, ing, {
          fontSize: "20px",
          fontFamily: "Arial",
          color: "#333",
        });

        const boxWidth = txt.width + paddingX;
        const boxHeight = txt.height + paddingY;

        if (x + boxWidth > maxWidth + 50) {
          x = 50;
          y += lineHeight;
        }

        const bg = this.add.rectangle(
          x + boxWidth / 2,
          y + boxHeight / 2,
          boxWidth,
          boxHeight,
          0xeeeeee
        );
        bg.setStrokeStyle(1, 0xcccccc);
        bg.setOrigin(0.5);

        txt.setPosition(x, y);
        txt.setDepth(1);

        [bg, txt].forEach((obj) => {
          obj.setInteractive({ useHandCursor: true });
          obj.on("pointerdown", () => {
            this.selectedIngredients.splice(i, 1);
            updateSelectedListDisplay();
          });
        });

        this.selectedTextGroup.add(bg);
        this.selectedTextGroup.add(txt);

        x += boxWidth;
      });
    };

    const clearButton = this.add
      .text(705, 100, "Clear All", {
        fontSize: "20px",
        backgroundColor: "#f88",
        color: "#fff",
        padding: { left: 10, right: 10, top: 5, bottom: 5 },
        fontFamily: "Arial",
        borderRadius: 5,
      })
      .setInteractive({ useHandCursor: true });

    clearButton.on("pointerdown", () => {
      this.selectedIngredients.length = 0;
      updateSelectedListDisplay();
    });

    for (let i = 0; i < 30; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * spacingX;
      const y = startY + row * spacingY;
      const index = i.toString().padStart(2, "0");
      const key = `ingredient${index}`;

      const bg = this.add
        .rectangle(x, y, 48, 48, 0xf0f0f0)
        .setStrokeStyle(2, 0xcccccc);
      bg.setOrigin(0.5);

      const img = this.add
        .image(x, y, key)
        .setScale(3)
        .setInteractive({ useHandCursor: true });

      img.customKey = key;

      img.on("pointerover", () => {
        bg.setFillStyle(0xfff3b0);
      });

      img.on("pointerout", () => {
        bg.setFillStyle(0xf0f0f0);
      });

      img.on("pointerdown", () => {
        const ingredientName = ingredientMap[img.customKey];
        this.selectedIngredients.push(ingredientName);
        updateSelectedListDisplay();
      });
    }

    const randomIndex = Phaser.Math.Between(0, burgers.length - 1);
    this.randomBurger = burgers[randomIndex];

    this.add
      .text(400, 65, `Build: ${this.randomBurger.name}`, {
        fontSize: "36px",
        color: "#d93b3b",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    const checkButton = this.add
      .text(663, 0, "✔ Check", {
        fontSize: "24px",
        backgroundColor: "#99e699",
        color: "#000",
        padding: { left: 20, right: 20, top: 10, bottom: 10 },
        fontFamily: "Arial",
        borderRadius: 10,
      })
      .setInteractive({ useHandCursor: true });

    checkButton.on("pointerover", () =>
      checkButton.setStyle({ backgroundColor: "#7cd67c" })
    );
    checkButton.on("pointerout", () =>
      checkButton.setStyle({ backgroundColor: "#99e699" })
    );

    checkButton.on("pointerdown", () => {
      const playerSorted = [...this.selectedIngredients].sort();
      const correctSorted = [...this.randomBurger.ingredients].sort();
      const success =
        playerSorted.length === correctSorted.length &&
        playerSorted.every((val, i) => val === correctSorted[i]);
      if (success) {
        alert("✅ Correct! Starting new order...");
        this.scene.restart();
      } else {
        alert("❌ Try Again!");
      }
    });
  }
}

export default function PhaserGame() {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      backgroundColor: "#f8f8f8",
      parent: "phaser-container",
      scene: [StartScene, GameScene],
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="phaser-container"></div>;
}
