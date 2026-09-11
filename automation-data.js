// 原本照合用の原文付き。tools/build-automation.cjsから生成。
globalThis.CARD_AUTOMATION = {
  "UR01": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "damage",
          "target": "enemies",
          "n": 3
        },
        {
          "op": "flags",
          "target": "enemy",
          "flags": [
            "cannotAttack"
          ],
          "duration": "nextEnemyEnd"
        }
      ],
      "sourceText": "登場時、敵全体に３ダメージを与える。敵１体を次の相手ターン終了まで攻撃不能にする。",
      "sourceName": "神罰の雷霆",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "turnStart",
      "effects": [
        {
          "op": "draw",
          "target": "owner",
          "n": 1
        },
        {
          "op": "buff",
          "target": "self",
          "stats": {
            "attack": 1
          },
          "duration": "turnEnd"
        }
      ],
      "sourceText": "自分のターン開始時、カードを１枚引く。そのターン、このカードの攻撃力＋１。",
      "sourceName": "神王",
      "automationType": "AUTO"
    }
  },
  "UR02": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "damage",
          "target": "enemy",
          "n": 5
        },
        {
          "op": "buff",
          "target": "allies",
          "stats": {
            "attack": 2
          },
          "duration": "turnEnd"
        }
      ],
      "sourceText": "登場時、敵１体に５ダメージを与える。そのターン、味方全体の攻撃力＋２。",
      "sourceName": "神槍グングニル",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "hasOther",
      "stats": {
        "defense": 2
      },
      "target": "self",
      "sourceText": "自分の場に他の味方がいる間、このカードの防御力＋２。",
      "sourceName": "大神の統率",
      "automationType": "AUTO"
    }
  },
  "UR03": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "grow",
          "target": "allies",
          "n": 2
        },
        {
          "op": "life",
          "target": "owner",
          "n": 4
        }
      ],
      "sourceText": "登場時、味方全体の兵力上限と現在兵力を２増やす。自分のライフを４回復する（上限まで）。",
      "sourceName": "天照の祝福",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "turnStart",
      "effects": [
        {
          "op": "heal",
          "target": "self",
          "n": 1
        }
      ],
      "sourceText": "自分のターン開始時、このカードの兵力を１回復する（上限まで）。",
      "sourceName": "太陽の加護",
      "automationType": "AUTO"
    }
  },
  "UR04": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "heal",
          "target": "allies",
          "n": 4
        },
        {
          "op": "buff",
          "target": "allies",
          "stats": {
            "defense": 2
          },
          "duration": "turnEnd"
        }
      ],
      "sourceText": "登場時、味方全体の兵力を４回復する（上限まで）。そのターン、味方全体の防御力＋２。",
      "sourceName": "月光の癒やし",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "hasOther",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の場に他の味方がいる間、このカードの防御力＋１。",
      "sourceName": "静夜の守り",
      "automationType": "AUTO"
    }
  },
  "UR05": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "heal",
          "target": "ally",
          "n": 4
        },
        {
          "op": "draw",
          "target": "owner",
          "n": 2
        }
      ],
      "sourceText": "登場時、味方１体の兵力を４回復する（上限まで）。さらにカードを２枚引く。",
      "sourceName": "福徳の祝福",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "always",
      "stats": {
        "defense": 1
      },
      "target": "otherAllies",
      "sourceText": "このカードが場にいる間、他の味方全体の防御力＋１。",
      "sourceName": "障害を除く守り",
      "automationType": "AUTO"
    }
  },
  "UR06": {
    "automationType": "MANUAL",
    "skill": {
      "trigger": "entry",
      "automationType": "MANUAL",
      "reason": "「次の自分のターンまで」の終了時点を裁定してください。",
      "sourceText": "登場時、敵１体に５ダメージを与える。その敵のスキルと特性を次の自分のターンまで無効にする。",
      "sourceName": "暴風の神剣"
    },
    "trait": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "self",
          "stats": {
            "attack": 2
          },
          "duration": "turnEnd"
        }
      ],
      "sourceText": "登場したターン、このカードの攻撃力＋２。",
      "sourceName": "荒魂の武勇",
      "automationType": "AUTO"
    }
  },
  "UR07": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "damage",
          "target": "enemies",
          "n": 3
        },
        {
          "op": "buff",
          "target": "enemies",
          "stats": {
            "defense": -2
          },
          "duration": "turnEnd"
        }
      ],
      "sourceText": "登場時、敵全体に３ダメージを与える。そのターン、敵全体の防御力－２。",
      "sourceName": "太陽神の灼光",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "full",
      "stats": {
        "attack": 2
      },
      "target": "self",
      "sourceText": "このカードの兵力が上限の間、攻撃力＋２。",
      "sourceName": "太陽の威光",
      "automationType": "AUTO"
    }
  },
  "UR08": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "damage",
          "target": "enemy",
          "n": 4
        }
      ],
      "sourceText": "登場時、敵１体に４ダメージを与える。",
      "sourceName": "戦女神の一閃",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "always",
      "stats": {
        "defense": 2
      },
      "target": "allies",
      "sourceText": "このカードが場にいる間、味方全体の防御力＋２。",
      "sourceName": "アイギスの守護",
      "automationType": "AUTO"
    }
  },
  "UR09": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "damage",
          "target": "enemies",
          "n": 2
        },
        {
          "op": "draw",
          "target": "owner",
          "n": 1
        },
        {
          "op": "buff",
          "target": "allies",
          "stats": {
            "attack": 1
          },
          "duration": "turnEnd"
        }
      ],
      "sourceText": "登場時、敵全体に２ダメージを与え、カードを１枚引く。そのターン、味方全体の攻撃力＋１。",
      "sourceName": "光明の旋律",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "handGE4",
      "stats": {
        "attack": 1
      },
      "target": "self",
      "sourceText": "自分の手札が４枚以上ある間、このカードの攻撃力＋１。",
      "sourceName": "調和の音律",
      "automationType": "AUTO"
    }
  },
  "SSR01": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "damage",
          "target": "enemy",
          "n": 3
        },
        {
          "op": "discard",
          "target": "enemyHand",
          "n": 1
        }
      ],
      "sourceText": "登場時、敵１体に３ダメージを与え、相手は手札を１枚選んで捨てる。",
      "sourceName": "天下布武",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "self",
          "stats": {
            "attack": 2
          },
          "duration": "turnEnd"
        }
      ],
      "sourceText": "登場したターン、このカードの攻撃力＋２。",
      "sourceName": "革新の炎",
      "automationType": "AUTO"
    }
  },
  "SSR02": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "draw",
          "target": "owner",
          "n": 1
        },
        {
          "op": "buff",
          "target": "allies",
          "stats": {
            "attack": 2
          },
          "duration": "turnEnd"
        }
      ],
      "sourceText": "登場時、カードを１枚引く。そのターン、味方全体の攻撃力＋２。",
      "sourceName": "天下人の采配",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "twoOthers",
      "stats": {
        "defense": 2
      },
      "target": "self",
      "sourceText": "他の味方が２体以上いる間、このカードの防御力＋２。",
      "sourceName": "結束の力",
      "automationType": "AUTO"
    }
  },
  "SSR03": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "life",
          "target": "owner",
          "n": 3
        }
      ],
      "sourceText": "登場時、自分のライフを３回復する（上限まで）。",
      "sourceName": "泰平への礎",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "hasOther",
      "stats": {
        "defense": 2
      },
      "target": "self",
      "sourceText": "自分の場に他の味方がいる間、このカードの防御力＋２。",
      "sourceName": "不動の守り",
      "automationType": "AUTO"
    }
  },
  "SSR04": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "passive",
      "condition": "lostTroop",
      "stats": {
        "attack": {
          "lostPer": 2,
          "max": 4
        }
      },
      "target": "self",
      "sourceText": "このカードの減った兵力２につき、攻撃力＋１（最大＋４）。",
      "sourceName": "六文銭の突撃",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "lessLife",
      "stats": {
        "attack": 2
      },
      "target": "self",
      "sourceText": "自分のライフが相手より少ない間、このカードの攻撃力＋２。",
      "sourceName": "不屈の闘志",
      "automationType": "AUTO"
    }
  },
  "SSR05": {
    "automationType": "MANUAL",
    "skill": {
      "trigger": "entry",
      "automationType": "MANUAL",
      "reason": "先に攻撃する効果と基本の攻撃手順の関係を裁定してください。",
      "sourceText": "登場したターン、敵１体の防御力－２。最初の戦闘では相手より先に攻撃する。",
      "sourceName": "神速の奇襲"
    },
    "trait": {
      "trigger": "passive",
      "condition": "hasOther",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の場に他の味方がいる間、このカードの防御力＋１。",
      "sourceName": "軽やかな身のこなし",
      "automationType": "AUTO"
    }
  },
  "SSR06": {
    "automationType": "MANUAL",
    "skill": {
      "trigger": "entry",
      "automationType": "MANUAL",
      "reason": "再攻撃の回数とタイミングを裁定してください。登場ターンの補正も手動です。",
      "followup": "kill",
      "limit": "game",
      "sourceText": "登場したターン、攻撃力＋２。敵を撃破した時、一度だけ再び攻撃できる。",
      "sourceName": "風林火山"
    },
    "trait": {
      "trigger": "passive",
      "condition": "hasOther",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の場に他の味方がいる間、このカードの防御力＋１。",
      "sourceName": "揺るがぬ軍略",
      "automationType": "AUTO"
    }
  },
  "SSR07": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "damage",
          "target": "enemy",
          "n": 3
        },
        {
          "op": "buff",
          "target": "self",
          "stats": {
            "defense": 2
          },
          "duration": "turnEnd"
        }
      ],
      "sourceText": "登場時、敵１体に３ダメージを与える。そのターン、このカードの防御力＋２。",
      "sourceName": "義の一閃",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "hasOther",
      "stats": {
        "attack": 1
      },
      "target": "self",
      "sourceText": "自分の場に他の味方がいる間、このカードの攻撃力＋１。",
      "sourceName": "守護の武勇",
      "automationType": "AUTO"
    }
  },
  "SSR08": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "draw",
          "target": "owner",
          "n": 2
        },
        {
          "op": "discount",
          "target": "owner",
          "n": 1,
          "duration": "turnEnd",
          "min": 0
        }
      ],
      "sourceText": "登場時、カードを２枚引く。このターン、次に出すカードのコスト－１。",
      "sourceName": "維新への航路",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "handGE4",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の手札が４枚以上ある間、このカードの防御力＋１。",
      "sourceName": "自由な発想",
      "automationType": "AUTO"
    }
  },
  "SSR09": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "flags",
          "target": "enemy",
          "flags": [
            "cannotAttack"
          ],
          "duration": "nextEnemyEnd"
        },
        {
          "op": "draw",
          "target": "owner",
          "n": 1
        }
      ],
      "sourceText": "登場時、敵１体を次の相手ターン終了まで攻撃不能にし、カードを１枚引く。",
      "sourceName": "神託の導き",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "handGE4",
      "stats": {
        "defense": 2
      },
      "target": "self",
      "sourceText": "自分の手札が４枚以上ある間、このカードの防御力＋２。",
      "sourceName": "祈りの守り",
      "automationType": "AUTO"
    }
  },
  "SSR10": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "heal",
          "target": "allies",
          "n": 3
        }
      ],
      "sourceText": "登場時、味方全体の兵力を３回復する（上限まで）。",
      "sourceName": "聖なる祈り",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "fewerAllies",
      "stats": {
        "attack": 1
      },
      "target": "allies",
      "sourceText": "味方の数が敵より少ない間、味方全体の攻撃力＋１。",
      "sourceName": "希望の旗",
      "automationType": "AUTO"
    }
  },
  "SSR11": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "draw",
          "target": "owner",
          "n": 2
        },
        {
          "op": "energy",
          "target": "owner",
          "n": 1
        }
      ],
      "sourceText": "登場時、カードを２枚引き、自分のエネルギーを１増やす。",
      "sourceName": "皇帝の進軍",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "twoOthers",
      "stats": {
        "attack": 1
      },
      "target": "self",
      "sourceText": "他の味方が２体以上いる間、このカードの攻撃力＋１。",
      "sourceName": "勝利への指揮",
      "automationType": "AUTO"
    }
  },
  "SSR12": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "kill",
      "effects": [
        {
          "op": "buff",
          "target": "self",
          "stats": {
            "attack": 1
          },
          "duration": null
        }
      ],
      "cap": 3,
      "sourceText": "このカードが敵を撃破するたび、攻撃力＋１（最大＋３）。",
      "sourceName": "征服王の進撃",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "kill",
      "effects": [
        {
          "op": "heal",
          "target": "self",
          "n": 2
        }
      ],
      "sourceText": "敵を撃破した時、このカードの兵力を２回復する（上限まで）。",
      "sourceName": "勝利の勢い",
      "automationType": "AUTO"
    }
  },
  "SSR13": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "enemies",
          "stats": {
            "attack": -1
          },
          "duration": "turnEnd"
        },
        {
          "op": "draw",
          "target": "owner",
          "n": 1
        }
      ],
      "sourceText": "登場したターン、敵全体の攻撃力－１。さらにカードを１枚引く。",
      "sourceName": "勝利への布石",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "twoOthers",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "他の味方が２体以上いる間、このカードの防御力＋１。",
      "sourceName": "揺るがぬ統率",
      "automationType": "AUTO"
    }
  },
  "SSR14": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "enemies",
          "stats": {
            "defense": -2
          },
          "duration": "turnEnd"
        }
      ],
      "sourceText": "登場したターン、敵全体の防御力－２。",
      "sourceName": "アルプスの奇襲",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "second",
      "stats": {
        "attack": 2
      },
      "target": "self",
      "sourceText": "この対戦で自分が後攻なら、このカードの攻撃力＋２。",
      "sourceName": "逆転の軍略",
      "automationType": "AUTO"
    }
  },
  "SSR15": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "damage",
          "target": "enemies",
          "n": 2
        }
      ],
      "sourceText": "登場時、敵全体に２ダメージを与える。",
      "sourceName": "蒼き狼の進撃",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "full",
      "stats": {
        "attack": 2
      },
      "target": "self",
      "sourceText": "このカードの兵力が上限の間、攻撃力＋２。",
      "sourceName": "万全の進軍",
      "automationType": "AUTO"
    }
  },
  "SSR16": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "passive",
      "condition": "fewerAllies",
      "stats": {
        "defense": 2
      },
      "target": "self",
      "sourceText": "味方の数が敵より少ない間、このカードの防御力＋２。",
      "sourceName": "不退の守り",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "always",
      "reduction": 1,
      "sourceText": "受けるダメージを１減らす（最小０）。",
      "sourceName": "鋼の忍耐",
      "automationType": "AUTO"
    }
  },
  "SSR17": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "damage",
          "target": "enemy",
          "n": 4
        }
      ],
      "sourceText": "登場時、敵１体に４ダメージを与える。",
      "sourceName": "獅子王の一撃",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "lessLife",
      "stats": {
        "attack": 2
      },
      "target": "self",
      "sourceText": "自分のライフが相手より少ない間、このカードの攻撃力＋２。",
      "sourceName": "獅子の闘志",
      "automationType": "AUTO"
    }
  },
  "SSR18": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "enemies",
          "stats": {
            "attack": -2
          },
          "duration": "turnEnd"
        },
        {
          "op": "heal",
          "target": "self",
          "n": 3
        }
      ],
      "sourceText": "登場したターン、敵全体の攻撃力－２。このカードの兵力を３回復する（上限まで）。",
      "sourceName": "天下統一",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "handGE4",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の手札が４枚以上ある間、このカードの防御力＋１。",
      "sourceName": "皇帝の威厳",
      "automationType": "AUTO"
    }
  },
  "SSR19": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "healCleanse",
          "target": "ally",
          "n": 4
        }
      ],
      "sourceText": "登場時、味方１体の兵力を４回復し、その味方の状態異常をすべて解除する。",
      "sourceName": "大師の祈り",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "hasOther",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の場に他の味方がいる間、このカードの防御力＋１。",
      "sourceName": "慈悲の心",
      "automationType": "AUTO"
    }
  },
  "SSR20": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "alliesSelect",
          "stats": {
            "attack": 1,
            "defense": 1
          },
          "duration": "turnEnd",
          "maxSelect": 3,
          "minSelect": 0
        }
      ],
      "sourceText": "登場したターン、味方を最大３体選び、攻撃力と防御力を＋１する。",
      "sourceName": "和の采配",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "twoOthers",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "他の味方が２体以上いる間、このカードの防御力＋１。",
      "sourceName": "協調の力",
      "automationType": "AUTO"
    }
  },
  "SSR21": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "draw",
          "target": "owner",
          "n": 1
        },
        {
          "op": "buff",
          "target": "ally",
          "stats": {
            "attack": 2,
            "defense": 2
          },
          "duration": "turnEnd"
        }
      ],
      "sourceText": "登場時、カードを１枚引く。そのターン、味方１体の攻撃力と防御力＋２。",
      "sourceName": "学びの導き",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "twoOthers",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "他の味方が２体以上いる間、このカードの防御力＋１。",
      "sourceName": "仁の教え",
      "automationType": "AUTO"
    }
  },
  "SSR22": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "reorder",
          "target": "deck",
          "n": 3
        },
        {
          "op": "flags",
          "target": "enemy",
          "flags": [
            "cannotAttack"
          ],
          "duration": "nextEnemyEnd"
        }
      ],
      "sourceText": "登場時、山札の上３枚を見て好きな順に戻す。敵１体を次の相手ターン終了まで攻撃不能にする。",
      "sourceName": "神算の布陣",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "handGE4",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の手札が４枚以上ある間、このカードの防御力＋１。",
      "sourceName": "軍師の備え",
      "automationType": "AUTO"
    }
  },
  "SSR23": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "choice",
          "options": [
            {
              "label": "2枚引く",
              "effects": [
                {
                  "op": "draw",
                  "target": "owner",
                  "n": 2
                }
              ]
            },
            {
              "label": "味方1体の兵力を3回復",
              "effects": [
                {
                  "op": "heal",
                  "target": "ally",
                  "n": 3
                }
              ]
            },
            {
              "label": "味方1体の攻撃力＋3（このターン）",
              "effects": [
                {
                  "op": "buff",
                  "target": "ally",
                  "stats": {
                    "attack": 3
                  },
                  "duration": "turnEnd"
                }
              ]
            }
          ]
        }
      ],
      "sourceText": "登場時、１つ選ぶ。２枚引く／味方１体の兵力を３回復する／このターン、味方１体の攻撃力＋３。",
      "sourceName": "万能の発想",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "handGE4",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の手札が４枚以上ある間、このカードの防御力＋１。",
      "sourceName": "探究の積み重ね",
      "automationType": "AUTO"
    }
  },
  "SSR24": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "enemy",
          "stats": {
            "attack": -3
          },
          "duration": "turnEnd"
        },
        {
          "op": "draw",
          "target": "owner",
          "n": 2
        }
      ],
      "sourceText": "登場したターン、敵１体の攻撃力－３。さらにカードを２枚引く。",
      "sourceName": "万有引力",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "handGE5",
      "stats": {
        "defense": 2
      },
      "target": "self",
      "sourceText": "自分の手札が５枚以上ある間、このカードの防御力＋２。",
      "sourceName": "法則の洞察",
      "automationType": "AUTO"
    }
  },
  "SSR25": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "energy",
          "target": "owner",
          "n": 1
        },
        {
          "op": "discount",
          "target": "owner",
          "n": 2,
          "duration": "turnEnd",
          "min": 0
        }
      ],
      "sourceText": "登場時、エネルギーを１増やす。このターン、次に出すカードのコスト－２。",
      "sourceName": "時空の発想",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "handGE4",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の手札が４枚以上ある間、このカードの防御力＋１。",
      "sourceName": "柔軟な思考",
      "automationType": "AUTO"
    }
  },
  "SSR26": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "discover",
          "target": "deck",
          "n": 4,
          "reorderRest": true
        }
      ],
      "sourceText": "登場時、山札の上４枚を見て１枚を手札に加える。残りを好きな順で山札の下に戻す。",
      "sourceName": "星空の観測",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "handGE4",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の手札が４枚以上ある間、このカードの防御力＋１。",
      "sourceName": "観測の積み重ね",
      "automationType": "AUTO"
    }
  },
  "SSR27": {
    "automationType": "MANUAL",
    "skill": {
      "trigger": "entry",
      "automationType": "MANUAL",
      "reason": "「次の自分のターンまで」の無効期間を裁定してください。全体防御補正も含め手動処理します。",
      "sourceText": "登場時、敵１体のスキルを次の自分のターンまで無効にする。そのターン、味方全体の防御力＋１。",
      "sourceName": "哲人の問答"
    },
    "trait": {
      "trigger": "passive",
      "condition": "hasOther",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の場に他の味方がいる間、このカードの防御力＋１。",
      "sourceName": "揺るがぬ精神",
      "automationType": "AUTO"
    }
  },
  "SR01": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "self",
          "stats": {
            "attack": 3
          },
          "duration": "turnEnd"
        }
      ],
      "sourceText": "登場したターン、このカードの攻撃力＋３。",
      "sourceName": "独眼竜の奇襲",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "hasOther",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の場に他の味方がいる間、このカードの防御力＋１。",
      "sourceName": "攻めの采配",
      "automationType": "AUTO"
    }
  },
  "SR02": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "flags",
          "target": "enemy",
          "flags": [
            "skillDisabled",
            "traitDisabled"
          ],
          "duration": "nextOwnStart"
        }
      ],
      "sourceText": "登場時、敵１体のスキルと特性を次の自分のターン開始まで無効にする。",
      "sourceName": "静謐の策略",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "handGE3",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の手札が３枚以上ある間、このカードの防御力＋１。",
      "sourceName": "冷静な判断",
      "automationType": "AUTO"
    }
  },
  "SR03": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "passive",
      "condition": "always",
      "stats": {
        "attack": {
          "perOther": 1,
          "max": 3
        }
      },
      "target": "self",
      "sourceText": "自分の場の他の味方１体につき、このカードの攻撃力＋１（最大＋３）。",
      "sourceName": "結束の采配",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "twoOthers",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "他の味方が２体以上いる間、このカードの防御力＋１。",
      "sourceName": "義の結束",
      "automationType": "AUTO"
    }
  },
  "SR04": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "beforeDeath",
      "limit": "game",
      "effects": [
        {
          "op": "survive",
          "target": "self",
          "n": 1
        }
      ],
      "sourceText": "兵力が０になる時、一度だけ兵力１で場に残る。",
      "sourceName": "不屈の武勇",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "hasOther",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の場に他の味方がいる間、このカードの防御力＋１。",
      "sourceName": "堅牢な守り",
      "automationType": "AUTO"
    }
  },
  "SR05": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "damage",
          "target": "enemy",
          "n": 4
        }
      ],
      "sourceText": "登場時、敵１体に４ダメージを与える。",
      "sourceName": "二天一流",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "oneEnemy",
      "stats": {
        "attack": 2
      },
      "target": "self",
      "sourceText": "相手の場に敵が１体だけなら、このカードの攻撃力＋２。",
      "sourceName": "一騎討ちの心得",
      "automationType": "AUTO"
    }
  },
  "SR06": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "energy",
          "target": "owner",
          "n": 2
        }
      ],
      "sourceText": "登場時、自分のエネルギーを２増やす。",
      "sourceName": "日宋貿易",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "handGE4",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の手札が４枚以上ある間、このカードの防御力＋１。",
      "sourceName": "交易の繁栄",
      "automationType": "AUTO"
    }
  },
  "SR07": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "allies",
          "stats": {
            "attack": 1,
            "defense": 1
          },
          "duration": "turnEnd"
        }
      ],
      "sourceText": "登場したターン、味方全体の攻撃力と防御力を＋１する。",
      "sourceName": "尼御台の号令",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "entry",
      "effects": [
        {
          "op": "heal",
          "target": "ally",
          "n": 2
        }
      ],
      "sourceText": "登場時、味方１体の兵力を２回復する（上限まで）。",
      "sourceName": "支えの言葉",
      "automationType": "SELECT"
    }
  },
  "SR08": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "if",
          "condition": "fewerAllies",
          "yes": [
            {
              "op": "buff",
              "target": "allies",
              "stats": {
                "attack": 2
              },
              "duration": "turnEnd"
            }
          ],
          "no": []
        }
      ],
      "sourceText": "登場時、味方の数が敵より少ないなら、そのターン、味方全体の攻撃力＋２。",
      "sourceName": "不屈の号令",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "hasOther",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の場に他の味方がいる間、このカードの防御力＋１。",
      "sourceName": "仲間への信頼",
      "automationType": "AUTO"
    }
  },
  "SR09": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "draw",
          "target": "owner",
          "n": 3
        },
        {
          "op": "discard",
          "target": "hand",
          "n": 1
        }
      ],
      "sourceText": "登場時、カードを３枚引き、その後、手札を１枚捨てる。",
      "sourceName": "物語の選択",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "handGE5",
      "stats": {
        "defense": 2
      },
      "target": "self",
      "sourceText": "自分の手札が５枚以上ある間、このカードの防御力＋２。",
      "sourceName": "深い洞察",
      "automationType": "AUTO"
    }
  },
  "SR10": {
    "automationType": "MANUAL",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "enemy",
          "stats": {
            "attack": -2
          },
          "duration": "nextOwnStart"
        }
      ],
      "sourceText": "登場時、敵１体の攻撃力を２下げる。効果は次の自分のターン開始時まで。",
      "sourceName": "女王の魅惑",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "combat",
      "automationType": "MANUAL",
      "reason": "攻撃力が下がっている敵との戦闘中だけの防御補正を手動で適用・解除してください。",
      "condition": "debuffEnemy",
      "sourceText": "攻撃力が下がっている敵との戦闘中、このカードの防御力＋１。",
      "sourceName": "王家の策略"
    }
  },
  "SR11": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "passive",
      "condition": "troopLE4",
      "stats": {
        "attack": 3
      },
      "target": "self",
      "sourceText": "自分の兵力が４以下の間、このカードの攻撃力＋３。",
      "sourceName": "不屈の反撃",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "survived",
      "limit": "turn",
      "effects": [
        {
          "op": "heal",
          "target": "self",
          "n": 1
        }
      ],
      "sourceText": "１ターンに１回、戦闘で生き残った時、自分の兵力を１回復する。",
      "sourceName": "解放の意志",
      "automationType": "AUTO"
    }
  },
  "SR12": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "afterAttack",
      "effects": [
        {
          "op": "heal",
          "target": "ally",
          "n": 2,
          "initialCap": true
        }
      ],
      "sourceText": "攻撃後、味方１体の兵力を２回復する。兵力は初期値を超えない。",
      "sourceName": "慈悲の進軍",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "hasOther",
      "stats": {
        "attack": 1
      },
      "target": "self",
      "sourceText": "自分の場に他の味方がいる間、このカードの攻撃力＋１。",
      "sourceName": "騎兵の統率",
      "automationType": "AUTO"
    }
  },
  "SR13": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "battleKill",
      "cap": 3,
      "effects": [
        {
          "op": "buff",
          "target": "self",
          "stats": {
            "attack": 1
          },
          "duration": null
        }
      ],
      "sourceText": "戦闘で敵を倒すたび、このカードの攻撃力＋１（最大＋３）。",
      "sourceName": "征服者の進撃",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "initialFull",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "兵力が初期値の時、このカードの防御力＋１。",
      "sourceName": "ノルマンの盾",
      "automationType": "AUTO"
    }
  },
  "SR14": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "allies",
          "stats": {
            "attack": 1
          },
          "duration": "turnEnd"
        }
      ],
      "sourceText": "登場時、味方全体の攻撃力＋１。効果はこのターン終了時まで。",
      "sourceName": "女王の号令",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "always",
      "stats": {
        "defense": 1
      },
      "target": "otherAllies",
      "sourceText": "このカードが場にいる間、他の味方全体の防御力＋１。",
      "sourceName": "王国の結束",
      "automationType": "AUTO"
    }
  },
  "SR15": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "passive",
      "condition": "always",
      "stats": {
        "attack": {
          "perOther": 1,
          "max": 3
        }
      },
      "target": "self",
      "sourceText": "他の味方１体につき、このカードの攻撃力＋１（最大＋３）。",
      "sourceName": "太陽王の威光",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "twoOthers",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "他の味方が２体以上いる間、このカードの防御力＋１。",
      "sourceName": "宮廷の守り",
      "automationType": "AUTO"
    }
  },
  "SR16": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "ally",
          "stats": {
            "attack": 2,
            "defense": 2
          },
          "duration": null,
          "filter": {
            "attackLE": 4
          }
        }
      ],
      "sourceText": "登場時、攻撃力４以下の味方１体の攻撃力と防御力をそれぞれ２上げる。",
      "sourceName": "大改革",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "turnStart",
      "effects": [
        {
          "op": "heal",
          "target": "ally",
          "n": 1,
          "filter": {
            "attackLE": 4
          }
        }
      ],
      "sourceText": "自分のターン開始時、攻撃力４以下の味方１体の兵力を１回復する。",
      "sourceName": "技術の導入",
      "automationType": "SELECT"
    }
  },
  "SR17": {
    "automationType": "MANUAL",
    "skill": {
      "trigger": "entry",
      "automationType": "MANUAL",
      "reason": "手札をランダムに見る処理と「次のターンまで」の期限は裁定が必要です。",
      "sourceText": "登場時、相手の手札を１枚ランダムに見る。さらに、敵１体の攻撃力を次のターンまで１下げる。",
      "sourceName": "兵法の洞察"
    },
    "trait": {
      "trigger": "passive",
      "condition": "enemyTurn",
      "stats": {
        "defense": 2
      },
      "target": "self",
      "sourceText": "相手のターン中、このカードの防御力＋２。",
      "sourceName": "備えの軍略",
      "automationType": "AUTO"
    }
  },
  "SR18": {
    "automationType": "MANUAL",
    "skill": {
      "trigger": "combat",
      "automationType": "MANUAL",
      "reason": "かばう対象・戦闘中の補正は手動裁定です。",
      "limit": "turn",
      "condition": "hasOther",
      "sourceText": "１ターンに１回、他の味方が受ける攻撃を、このカードが代わりに受ける。",
      "sourceName": "忠義の守護"
    },
    "trait": {
      "trigger": "combat",
      "automationType": "MANUAL",
      "reason": "かばった戦闘中だけ防御力＋2を手動で適用・解除してください。",
      "condition": "hasOther",
      "sourceText": "味方をかばう戦闘中、このカードの防御力＋２。",
      "sourceName": "不屈の忠誠"
    }
  },
  "SR19": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "search",
          "target": "deck",
          "n": 1,
          "filter": {
            "costLE": 4
          },
          "shuffle": true,
          "public": true
        }
      ],
      "sourceText": "登場時、山札からコスト４以下のカードを１枚公開して手札に加え、山札を切る。",
      "sourceName": "東方への道",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "handGE5",
      "stats": {
        "defense": 2
      },
      "target": "self",
      "sourceText": "自分の手札が５枚以上ある間、このカードの防御力＋２。",
      "sourceName": "旅の知恵",
      "automationType": "AUTO"
    }
  },
  "SR20": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "draw",
          "target": "owner",
          "n": 2
        },
        {
          "op": "discard",
          "target": "hand",
          "n": 1
        }
      ],
      "sourceText": "登場時、山札からカードを２枚引き、その後、手札を１枚捨てる。",
      "sourceName": "大西洋の航路",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "handGE4",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の手札が４枚以上ある間、このカードの防御力＋１。",
      "sourceName": "航海の備え",
      "automationType": "AUTO"
    }
  },
  "SR21": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "reorder",
          "target": "deck",
          "n": 3
        }
      ],
      "sourceText": "登場時、山札の上から３枚を見る。好きな順番で山札の上に戻す。",
      "sourceName": "未知なる海峡",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "turnStart",
      "effects": [
        {
          "op": "optionalBottom",
          "target": "deck",
          "n": 1
        }
      ],
      "sourceText": "自分のターン開始時、山札の一番上の１枚を見て、山札の下に移してもよい。",
      "sourceName": "航路の選択",
      "automationType": "SELECT"
    }
  },
  "SR22": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "otherAlly",
          "stats": {
            "attack": 2,
            "defense": 2
          },
          "duration": null
        }
      ],
      "sourceText": "登場時、他の味方１体の攻撃力と防御力をそれぞれ２上げる。",
      "sourceName": "発明のひらめき",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "turnStart",
      "effects": [
        {
          "op": "buff",
          "target": "otherAlly",
          "stats": {
            "attack": 1
          },
          "duration": null,
          "targetCap": 2
        }
      ],
      "sourceText": "自分のターン開始時、他の味方１体の攻撃力＋１（この特性では最大＋２）。",
      "sourceName": "改良の積み重ね",
      "automationType": "SELECT"
    }
  },
  "SR23": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "energy",
          "target": "owner",
          "n": 2
        }
      ],
      "sourceText": "登場時、自分のエネルギーを２増やす。",
      "sourceName": "電磁誘導",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "turnStart",
      "effects": [
        {
          "op": "energy",
          "target": "owner",
          "n": 1
        }
      ],
      "sourceText": "自分のターン開始時、自分のエネルギーを１増やす。",
      "sourceName": "実験の積み重ね",
      "automationType": "AUTO"
    }
  },
  "SR24": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "discount",
          "target": "owner",
          "n": 2,
          "duration": "turnEnd",
          "min": 1
        }
      ],
      "sourceText": "登場時、このターンに次に使うカード１枚のコストを２下げる（最低１）。",
      "sourceName": "計算する知恵",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "always",
      "firstDiscount": 1,
      "sourceText": "自分の手札が３枚以下なら、毎ターン最初に使うカードのコスト－１（最低１）。",
      "sourceName": "思考の節約",
      "automationType": "AUTO"
    }
  },
  "SR25": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "grow",
          "target": "allies",
          "n": 2
        }
      ],
      "sourceText": "登場時、味方全体の兵力と兵力の上限をそれぞれ２増やす。",
      "sourceName": "運命の交響曲",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "always",
      "stats": {
        "attack": 1
      },
      "target": "woundedAllies",
      "sourceText": "兵力が初期値の半分以下の味方は、このカードが場にいる間、攻撃力＋１。",
      "sourceName": "不屈の旋律",
      "automationType": "AUTO"
    }
  },
  "SR26": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "draw",
          "target": "owner",
          "n": 1
        },
        {
          "op": "heal",
          "target": "ally",
          "n": 2
        }
      ],
      "sourceText": "登場時、カードを１枚引く。味方１体の兵力を２回復する（上限まで）。",
      "sourceName": "癒やしのセレナーデ",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "turnStart",
      "effects": [
        {
          "op": "heal",
          "target": "ally",
          "n": 1
        }
      ],
      "sourceText": "自分のターン開始時、味方１体の兵力を１回復する（上限まで）。",
      "sourceName": "調和のしらべ",
      "automationType": "SELECT"
    }
  },
  "SR27": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "if",
          "condition": "handLE3",
          "yes": [
            {
              "op": "draw",
              "target": "owner",
              "n": 1
            }
          ],
          "no": [
            {
              "op": "buff",
              "target": "ally",
              "stats": {
                "attack": 2
              },
              "duration": null
            }
          ]
        }
      ],
      "sourceText": "登場時、手札が３枚以下なら１枚引く。４枚以上なら味方１体の攻撃力＋２。",
      "sourceName": "運命の一幕",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "always",
      "stats": {
        "attack": {
          "troopGE": 5,
          "value": 1
        },
        "defense": {
          "troopLE": 4,
          "value": 2
        }
      },
      "target": "self",
      "sourceText": "兵力が５以上なら攻撃力＋１。兵力が４以下なら防御力＋２。",
      "sourceName": "喜劇と悲劇",
      "automationType": "AUTO"
    }
  },
  "R01": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "ally",
          "stats": {
            "defense": 2
          },
          "duration": "nextOwnStart"
        }
      ],
      "sourceText": "登場時、味方１体の防御力＋２。効果は次の自分のターン開始時まで。",
      "sourceName": "鎮護の祈り",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "entry",
      "effects": [
        {
          "op": "heal",
          "target": "ally",
          "n": 1
        }
      ],
      "sourceText": "登場時、味方１体の兵力を１回復する（上限まで）。",
      "sourceName": "慈しみの心",
      "automationType": "SELECT"
    }
  },
  "R02": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "otherAlly",
          "stats": {
            "attack": 1
          },
          "duration": "turnEnd"
        }
      ],
      "sourceText": "登場時、他の味方１体の攻撃力＋１。効果はこのターン終了時まで。",
      "sourceName": "新都の号令",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "hasOther",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の場に他の味方がいる間、このカードの防御力＋１。",
      "sourceName": "都の統率",
      "automationType": "AUTO"
    }
  },
  "R03": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "energy",
          "target": "owner",
          "n": 1
        }
      ],
      "sourceText": "登場時、自分のエネルギーを１増やす。",
      "sourceName": "宮廷の采配",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "twoOthers",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "他の味方が２体以上いる間、このカードの防御力＋１。",
      "sourceName": "貴族の結束",
      "automationType": "AUTO"
    }
  },
  "R04": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "draw",
          "target": "owner",
          "n": 1
        }
      ],
      "sourceText": "登場時、山札からカードを１枚引く。",
      "sourceName": "学問のひらめき",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "handGE4",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の手札が４枚以上ある間、このカードの防御力＋１。",
      "sourceName": "知恵の蓄え",
      "automationType": "AUTO"
    }
  },
  "R05": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "otherAlly",
          "stats": {
            "attack": 1
          },
          "duration": "nextOwnStart"
        }
      ],
      "sourceText": "登場時、他の味方１体の攻撃力＋１。効果は次の自分のターン開始時まで。",
      "sourceName": "鎌倉の号令",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "twoOthers",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "他の味方が２体以上いる間、このカードの防御力＋１。",
      "sourceName": "武家の結束",
      "automationType": "AUTO"
    }
  },
  "R06": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "self",
          "stats": {
            "attack": 2
          },
          "duration": "turnEnd"
        }
      ],
      "sourceText": "登場したターン、このカードの攻撃力＋２。",
      "sourceName": "突破の太刀",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "initialFull",
      "stats": {
        "attack": 1
      },
      "target": "self",
      "sourceText": "自分の兵力が初期値の時、このカードの攻撃力＋１。",
      "sourceName": "攻めの気迫",
      "automationType": "AUTO"
    }
  },
  "R07": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "energy",
          "target": "owner",
          "n": 1
        }
      ],
      "sourceText": "登場時、自分のエネルギーを１増やす。",
      "sourceName": "交易の実り",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "entry",
      "effects": [
        {
          "op": "if",
          "condition": "twoOthers",
          "yes": [
            {
              "op": "draw",
              "target": "owner",
              "n": 1
            }
          ],
          "no": []
        }
      ],
      "sourceText": "他の味方が２体以上いる時に登場すると、山札からカードを１枚引く。",
      "sourceName": "繁栄の支え",
      "automationType": "AUTO"
    }
  },
  "R08": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "passive",
      "condition": "entryTurn",
      "pierce": 1,
      "sourceText": "登場したターン、攻撃する敵の防御力を１低いものとして扱う。",
      "sourceName": "夜明けの奇襲",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "fewerAllies",
      "stats": {
        "attack": 1
      },
      "target": "self",
      "sourceText": "相手の場のカード数が自分より多い間、このカードの攻撃力＋１。",
      "sourceName": "機をうかがう目",
      "automationType": "AUTO"
    }
  },
  "R09": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "enemy",
          "stats": {
            "attack": -1
          },
          "duration": "nextOwnStart"
        }
      ],
      "sourceText": "登場時、敵１体の攻撃力を１下げる。効果は次の自分のターン開始時まで。",
      "sourceName": "三矢の策",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "twoOthers",
      "stats": {
        "attack": 1,
        "defense": 1
      },
      "target": "self",
      "sourceText": "他の味方が２体以上いる間、このカードの攻撃力と防御力＋１。",
      "sourceName": "三本の矢",
      "automationType": "AUTO"
    }
  },
  "R10": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "otherAlly",
          "stats": {
            "attack": 1
          },
          "duration": "turnEnd"
        }
      ],
      "sourceText": "登場時、他の味方１体の攻撃力＋１。効果はこのターン終了時まで。",
      "sourceName": "土佐の号令",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "cheapAlly",
      "stats": {
        "attack": 1
      },
      "target": "self",
      "sourceText": "コスト３以下の味方がいる間、このカードの攻撃力＋１。",
      "sourceName": "一領具足の絆",
      "automationType": "AUTO"
    }
  },
  "R11": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "self",
          "stats": {
            "attack": 2
          },
          "duration": "turnEnd"
        }
      ],
      "sourceText": "登場したターン、このカードの攻撃力＋２。",
      "sourceName": "薩摩の猛攻",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "troopLE3",
      "stats": {
        "attack": 1
      },
      "target": "self",
      "sourceText": "自分の兵力が３以下の間、このカードの攻撃力＋１。",
      "sourceName": "不屈の武勇",
      "automationType": "AUTO"
    }
  },
  "R12": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "otherAlly",
          "stats": {
            "defense": 2
          },
          "duration": "nextOwnStart"
        }
      ],
      "sourceText": "登場時、他の味方１体の防御力＋２。効果は次の自分のターン開始時まで。",
      "sourceName": "女城主の守り",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "hasOther",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の場に他の味方がいる間、このカードの防御力＋１。",
      "sourceName": "里を守る決意",
      "automationType": "AUTO"
    }
  },
  "R13": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "ally",
          "stats": {
            "attack": 1,
            "defense": 1
          },
          "duration": null,
          "filter": {
            "attackLE": 3
          }
        }
      ],
      "sourceText": "登場時、攻撃力３以下の味方１体の攻撃力と防御力をそれぞれ１上げる。",
      "sourceName": "改革の一歩",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "cheapOther",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "コスト３以下の他の味方がいる間、このカードの防御力＋１。",
      "sourceName": "実務の積み重ね",
      "automationType": "AUTO"
    }
  },
  "R14": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "energy",
          "target": "owner",
          "n": 1
        }
      ],
      "sourceText": "登場時、自分のエネルギーを１増やす。",
      "sourceName": "政治の調整",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "entry",
      "effects": [
        {
          "op": "if",
          "condition": "handLE3",
          "yes": [
            {
              "op": "draw",
              "target": "owner",
              "n": 1
            },
            {
              "op": "discard",
              "target": "hand",
              "n": 1
            }
          ],
          "no": []
        }
      ],
      "sourceText": "登場時、手札が３枚以下なら、カードを１枚引き、その後１枚捨てる。",
      "sourceName": "対話の手腕",
      "automationType": "SELECT"
    }
  },
  "R15": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "draw",
          "target": "owner",
          "n": 1
        }
      ],
      "sourceText": "登場時、山札からカードを１枚引く。",
      "sourceName": "学びのすすめ",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "alone",
      "stats": {
        "attack": 1,
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の場に他の味方がいない間、このカードの攻撃力と防御力＋１。",
      "sourceName": "独立の精神",
      "automationType": "AUTO"
    }
  },
  "R16": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "otherAlly",
          "stats": {
            "attack": 1
          },
          "duration": "nextOwnStart"
        }
      ],
      "sourceText": "登場時、他の味方１体の攻撃力＋１。効果は次の自分のターン開始時まで。",
      "sourceName": "雄弁なる号令",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "twoOthers",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "他の味方が２体以上いる間、このカードの防御力＋１。",
      "sourceName": "都市の結束",
      "automationType": "AUTO"
    }
  },
  "R17": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "heal",
          "target": "ally",
          "n": 2
        }
      ],
      "sourceText": "登場時、味方１体の兵力を２回復する（上限まで）。",
      "sourceName": "帝国の安定",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "twoOthers",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "他の味方が２体以上いる間、このカードの防御力＋１。",
      "sourceName": "統治の礎",
      "automationType": "AUTO"
    }
  },
  "R18": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "self",
          "stats": {
            "defense": 2
          },
          "duration": "nextOwnStart"
        }
      ],
      "sourceText": "登場したターンから次の自分のターン開始時まで、防御力＋２。",
      "sourceName": "皇帝の守護",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "initialFull",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の兵力が初期値の時、このカードの防御力＋１。",
      "sourceName": "堅固な備え",
      "automationType": "AUTO"
    }
  },
  "R19": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "otherAlly",
          "stats": {
            "attack": 1
          },
          "duration": "nextOwnStart"
        }
      ],
      "sourceText": "登場時、他の味方１体の攻撃力＋１。効果は次の自分のターン開始時まで。",
      "sourceName": "王国の号令",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "twoOthers",
      "stats": {
        "attack": 1
      },
      "target": "self",
      "sourceText": "他の味方が２体以上いる間、このカードの攻撃力＋１。",
      "sourceName": "王の統率",
      "automationType": "AUTO"
    }
  },
  "R20": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "passive",
      "condition": "troopLE4",
      "stats": {
        "attack": 2
      },
      "target": "self",
      "sourceText": "自分の兵力が４以下の間、このカードの攻撃力＋２。",
      "sourceName": "不屈の反撃",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "survived",
      "limit": "turn",
      "effects": [
        {
          "op": "heal",
          "target": "self",
          "n": 1
        }
      ],
      "sourceText": "１ターンに１回、戦闘で生き残った時、自分の兵力を１回復する（上限まで）。",
      "sourceName": "立ち上がる勇気",
      "automationType": "AUTO"
    }
  },
  "R21": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "enemy",
          "stats": {
            "defense": -1
          },
          "duration": "turnEnd"
        }
      ],
      "sourceText": "登場時、敵１体の防御力を１下げる。効果はこのターン終了時まで。",
      "sourceName": "大王の軍略",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "fewerAllies",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "相手の場のカード数が自分より多い間、このカードの防御力＋１。",
      "sourceName": "冷静な指揮",
      "automationType": "AUTO"
    }
  },
  "R22": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "heal",
          "target": "ally",
          "n": 2
        }
      ],
      "sourceText": "登場時、味方１体の兵力を２回復する（上限まで）。",
      "sourceName": "女王の支援",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "twoOthers",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "他の味方が２体以上いる間、このカードの防御力＋１。",
      "sourceName": "宮廷の結束",
      "automationType": "AUTO"
    }
  },
  "R23": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "otherAlly",
          "stats": {
            "attack": 1
          },
          "duration": "nextOwnStart"
        }
      ],
      "sourceText": "登場時、他の味方１体の攻撃力＋１。効果は次の自分のターン開始時まで。",
      "sourceName": "結束の号令",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "twoOthers",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "他の味方が２体以上いる間、このカードの防御力＋１。",
      "sourceName": "指導者の信頼",
      "automationType": "AUTO"
    }
  },
  "R24": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "otherAlly",
          "stats": {
            "defense": 1
          },
          "duration": "nextOwnStart"
        }
      ],
      "sourceText": "登場時、他の味方１体の防御力＋１。効果は次の自分のターン開始時まで。",
      "sourceName": "希望の演説",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "entry",
      "effects": [
        {
          "op": "heal",
          "target": "ally",
          "n": 1
        }
      ],
      "sourceText": "登場時、味方１体の兵力を１回復する（上限まで）。",
      "sourceName": "寄り添う心",
      "automationType": "SELECT"
    }
  },
  "R25": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "self",
          "stats": {
            "attack": 2
          },
          "duration": "turnEnd"
        }
      ],
      "sourceText": "登場したターン、このカードの攻撃力＋２。",
      "sourceName": "赤シャツの進撃",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "hasOther",
      "stats": {
        "attack": 1
      },
      "target": "self",
      "sourceText": "自分の場に他の味方がいる間、このカードの攻撃力＋１。",
      "sourceName": "義勇の気迫",
      "automationType": "AUTO"
    }
  },
  "R26": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "ally",
          "stats": {
            "attack": 1,
            "defense": 1
          },
          "duration": null,
          "filter": {
            "attackLE": 3
          }
        }
      ],
      "sourceText": "登場時、攻撃力３以下の味方１体の攻撃力と防御力をそれぞれ１上げる。",
      "sourceName": "改革の志",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "cheapOther",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "コスト３以下の他の味方がいる間、このカードの防御力＋１。",
      "sourceName": "志の結束",
      "automationType": "AUTO"
    }
  },
  "R27": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "otherAlly",
          "stats": {
            "attack": 1
          },
          "duration": "nextOwnStart"
        }
      ],
      "sourceText": "登場時、他の味方１体の攻撃力＋１。効果は次の自分のターン開始時まで。",
      "sourceName": "人望の采配",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "twoOthers",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "他の味方が２体以上いる間、このカードの防御力＋１。",
      "sourceName": "仲間を生かす才",
      "automationType": "AUTO"
    }
  },
  "R28": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "self",
          "stats": {
            "attack": 2
          },
          "duration": "turnEnd"
        }
      ],
      "sourceText": "登場したターン、このカードの攻撃力＋２。",
      "sourceName": "覇王の一撃",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "initialFull",
      "stats": {
        "attack": 1
      },
      "target": "self",
      "sourceText": "自分の兵力が初期値の時、このカードの攻撃力＋１。",
      "sourceName": "猛将の気迫",
      "automationType": "AUTO"
    }
  },
  "R29": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "enemy",
          "stats": {
            "attack": -1
          },
          "duration": "nextOwnStart"
        }
      ],
      "sourceText": "登場時、敵１体の攻撃力を１下げる。効果は次の自分のターン開始時まで。",
      "sourceName": "乱世の軍略",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "handGE4",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の手札が４枚以上ある間、このカードの防御力＋１。",
      "sourceName": "策士の備え",
      "automationType": "AUTO"
    }
  },
  "R30": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "otherAlly",
          "stats": {
            "attack": 1,
            "defense": 1
          },
          "duration": null
        }
      ],
      "sourceText": "登場時、他の味方１体の攻撃力と防御力をそれぞれ１上げる。",
      "sourceName": "仁徳の支え",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "twoOthers",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "他の味方が２体以上いる間、このカードの防御力＋１。",
      "sourceName": "絆の力",
      "automationType": "AUTO"
    }
  },
  "R31": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "self",
          "stats": {
            "attack": 2
          },
          "duration": "turnEnd"
        }
      ],
      "sourceText": "登場したターン、このカードの攻撃力＋２。",
      "sourceName": "義勇の一閃",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "hasOther",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の場に他の味方がいる間、このカードの防御力＋１。",
      "sourceName": "揺るがぬ忠義",
      "automationType": "AUTO"
    }
  },
  "R32": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "self",
          "stats": {
            "attack": 2
          },
          "duration": "turnEnd"
        }
      ],
      "sourceText": "登場したターン、このカードの攻撃力＋２。",
      "sourceName": "猛将の突撃",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "troopLE4",
      "stats": {
        "attack": 1
      },
      "target": "self",
      "sourceText": "自分の兵力が４以下の間、このカードの攻撃力＋１。",
      "sourceName": "豪胆な気迫",
      "automationType": "AUTO"
    }
  },
  "R33": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "reorder",
          "target": "deck",
          "n": 2
        }
      ],
      "sourceText": "登場時、山札の上から２枚を見て、好きな順番で山札の上に戻す。",
      "sourceName": "歴史の記録",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "handGE4",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の手札が４枚以上ある間、このカードの防御力＋１。",
      "sourceName": "知識の蓄え",
      "automationType": "AUTO"
    }
  },
  "R34": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "discover",
          "target": "deck",
          "n": 3,
          "reorderRest": false
        }
      ],
      "sourceText": "登場時、山札の上から３枚を見る。１枚を手札に加え、残りを山札の下に戻す。",
      "sourceName": "西方への探求",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "troopLE3",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の兵力が３以下の間、このカードの防御力＋１。",
      "sourceName": "旅の忍耐",
      "automationType": "AUTO"
    }
  },
  "R35": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "reorder",
          "target": "deck",
          "n": 3
        }
      ],
      "sourceText": "登場時、山札の上から３枚を見る。好きな順番で山札の上に戻す。",
      "sourceName": "大船団の航路",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "handGE4",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の手札が４枚以上ある間、このカードの防御力＋１。",
      "sourceName": "航海の備え",
      "automationType": "AUTO"
    }
  },
  "R36": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "otherAlly",
          "stats": {
            "attack": 2
          },
          "duration": null
        }
      ],
      "sourceText": "登場時、他の味方１体の攻撃力を２上げる。",
      "sourceName": "てこのひらめき",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "cheapOther",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "コスト３以下の他の味方がいる間、このカードの防御力＋１。",
      "sourceName": "工夫の積み重ね",
      "automationType": "AUTO"
    }
  },
  "R37": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "heal",
          "target": "ally",
          "n": 2
        }
      ],
      "sourceText": "登場時、味方１体の兵力を２回復する（上限まで）。",
      "sourceName": "癒やしの手当て",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "entry",
      "effects": [
        {
          "op": "if",
          "condition": "twoOthers",
          "yes": [
            {
              "op": "heal",
              "target": "ally",
              "n": 1
            }
          ],
          "no": []
        }
      ],
      "sourceText": "登場時、他の味方が２体以上いるなら、さらに味方１体の兵力を１回復する。",
      "sourceName": "丁寧な看護",
      "automationType": "SELECT"
    }
  },
  "R38": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "otherAlly",
          "stats": {
            "attack": 1,
            "defense": 1
          },
          "duration": null
        }
      ],
      "sourceText": "登場時、他の味方１体の攻撃力と防御力をそれぞれ１上げる。",
      "sourceName": "巨匠の造形",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "passive",
      "condition": "initialFull",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の兵力が初期値の時、このカードの防御力＋１。",
      "sourceName": "磨き上げる情熱",
      "automationType": "AUTO"
    }
  },
  "R39": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "buff",
          "target": "otherAlly",
          "stats": {
            "defense": 1
          },
          "duration": "nextOwnStart"
        }
      ],
      "sourceText": "登場時、他の味方１体の防御力＋１。効果は次の自分のターン開始時まで。",
      "sourceName": "調和の彩り",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "entry",
      "effects": [
        {
          "op": "heal",
          "target": "ally",
          "n": 1
        }
      ],
      "sourceText": "登場時、味方１体の兵力を１回復する（上限まで）。",
      "sourceName": "優美な支え",
      "automationType": "SELECT"
    }
  },
  "R40": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "draw",
          "target": "owner",
          "n": 1
        }
      ],
      "sourceText": "登場時、山札からカードを１枚引く。",
      "sourceName": "活版印刷",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "handGE4",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の手札が４枚以上ある間、このカードの防御力＋１。",
      "sourceName": "知識の普及",
      "automationType": "AUTO"
    }
  },
  "R41": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "energy",
          "target": "owner",
          "n": 1
        }
      ],
      "sourceText": "登場時、自分のエネルギーを１増やす。",
      "sourceName": "蒸気機関",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "cheapOther",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "コスト３以下の他の味方がいる間、このカードの防御力＋１。",
      "sourceName": "改良の積み重ね",
      "automationType": "AUTO"
    }
  },
  "R42": {
    "automationType": "MANUAL",
    "skill": {
      "trigger": "entry",
      "automationType": "MANUAL",
      "reason": "「相手より先に攻撃する」と基本ルールとの関係を裁定してください。",
      "sourceText": "登場したターンの最初の戦闘では、相手より先に攻撃する。",
      "sourceName": "はじまりの飛翔"
    },
    "trait": {
      "trigger": "passive",
      "condition": "hasOther",
      "stats": {
        "attack": 1
      },
      "target": "self",
      "sourceText": "自分の場に他の味方がいる間、このカードの攻撃力＋１。",
      "sourceName": "兄弟の連携",
      "automationType": "AUTO"
    }
  },
  "R43": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "heal",
          "target": "ally",
          "n": 2
        }
      ],
      "sourceText": "登場時、味方１体の兵力を２回復する（上限まで）。",
      "sourceName": "灯りの看護",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "entry",
      "effects": [
        {
          "op": "if",
          "condition": "twoOthers",
          "yes": [
            {
              "op": "heal",
              "target": "ally",
              "n": 1
            }
          ],
          "no": []
        }
      ],
      "sourceText": "登場時、他の味方が２体以上いるなら、さらに味方１体の兵力を１回復する。",
      "sourceName": "献身の心",
      "automationType": "SELECT"
    }
  },
  "R44": {
    "automationType": "AUTO",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "energy",
          "target": "owner",
          "n": 1
        }
      ],
      "sourceText": "登場時、自分のエネルギーを１増やす。",
      "sourceName": "科学の探究",
      "automationType": "AUTO"
    },
    "trait": {
      "trigger": "passive",
      "condition": "handGE4",
      "stats": {
        "defense": 1
      },
      "target": "self",
      "sourceText": "自分の手札が４枚以上ある間、このカードの防御力＋１。",
      "sourceName": "研究の積み重ね",
      "automationType": "AUTO"
    }
  },
  "R45": {
    "automationType": "SELECT",
    "skill": {
      "trigger": "entry",
      "effects": [
        {
          "op": "heal",
          "target": "ally",
          "n": 2
        }
      ],
      "sourceText": "登場時、味方１体の兵力を２回復する（上限まで）。",
      "sourceName": "研究の成果",
      "automationType": "SELECT"
    },
    "trait": {
      "trigger": "entry",
      "effects": [
        {
          "op": "if",
          "condition": "handLE3",
          "yes": [
            {
              "op": "draw",
              "target": "owner",
              "n": 1
            },
            {
              "op": "discard",
              "target": "hand",
              "n": 1
            }
          ],
          "no": []
        }
      ],
      "sourceText": "登場時、手札が３枚以下なら、カードを１枚引き、その後１枚捨てる。",
      "sourceName": "探究する心",
      "automationType": "SELECT"
    }
  }
};
