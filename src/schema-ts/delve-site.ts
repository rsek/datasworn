import { JSONSchema7 } from 'json-schema'

const schema: JSONSchema7 = {
  definitions: {
    DelveSite: {
      type: 'object',
      required: [
        'name',
        'source',
        'rank',
        'theme',
        'domain',
        'denizens'
      ],
      properties: {
        name: {
          $ref: '#/definitions/LocalizedLabel'
        },
        source: {
          $ref: '#/definitions/Source'
        },
        rank: {
          $ref: '#/definitions/ChallengeRank'
        },
        theme: {
          $ref: '#/definitions/DelveSiteTheme.ID'
        },
        domain: {
          $ref: '#/definitions/DelveSiteDomain.ID'
        },
        denizens: {
          type: 'array',
          allOf: [
            {
              items: {
                $ref: '#/definitions/DelveSiteDenizen'
              }
            },
            {
              additionalItems: false,
              items: [
                {
                  properties: {
                    rarity: {
                      const: 'very_common'
                    },
                    floor: {
                      const: 1
                    },
                    ceiling: {
                      const: 27
                    }
                  }
                },
                {
                  properties: {
                    rarity: {
                      const: 'common'
                    },
                    floor: {
                      const: 28
                    },
                    ceiling: {
                      const: 41
                    }
                  }
                },
                {
                  properties: {
                    rarity: {
                      const: 'common'
                    },
                    floor: {
                      const: 42
                    },
                    ceiling: {
                      const: 55
                    }
                  }
                },
                {
                  properties: {
                    rarity: {
                      const: 'common'
                    },
                    floor: {
                      const: 56
                    },
                    ceiling: {
                      const: 69
                    }
                  }
                },
                {
                  properties: {
                    rarity: {
                      const: 'uncommon'
                    },
                    floor: {
                      const: 70
                    },
                    ceiling: {
                      const: 75
                    }
                  }
                },
                {
                  properties: {
                    rarity: {
                      const: 'uncommon'
                    },
                    floor: {
                      const: 76
                    },
                    ceiling: {
                      const: 81
                    }
                  }
                },
                {
                  properties: {
                    rarity: {
                      const: 'uncommon'
                    },
                    floor: {
                      const: 82
                    },
                    ceiling: {
                      const: 87
                    }
                  }
                },
                {
                  properties: {
                    rarity: {
                      const: 'uncommon'
                    },
                    floor: {
                      const: 88
                    },
                    ceiling: {
                      const: 93
                    }
                  }
                },
                {
                  properties: {
                    rarity: {
                      const: 'rare'
                    },
                    floor: {
                      const: 94
                    },
                    ceiling: {
                      const: 95
                    }
                  }
                },
                {
                  properties: {
                    rarity: {
                      const: 'rare'
                    },
                    floor: {
                      const: 96
                    },
                    ceiling: {
                      const: 97
                    }
                  }
                },
                {
                  properties: {
                    rarity: {
                      const: 'rare'
                    },
                    floor: {
                      const: 98
                    },
                    ceiling: {
                      const: 99
                    }
                  }
                },
                {
                  properties: {
                    rarity: {
                      const: 'unforeseen'
                    },
                    floor: {
                      const: 100
                    },
                    ceiling: {
                      const: 100
                    }
                  }
                }
              ]
            }
          ]
        }
      }
    },
    Rarity: {
      type: 'object',
      additionalProperties: false,
      required: [
        'name',
        'asset',
        'source',
        'xp_cost',
        'description'
      ],
      properties: {
        _id: {
          $ref: '#/definitions/Rarity.ID'
        },
        name: {
          $ref: '#/definitions/LocalizedLabel'
        },
        icon: {
          $ref: '#/definitions/Icon'
        },
        asset: {
          $ref: '#/definitions/Asset.ID'
        },
        source: {
          $ref: '#/definitions/Source'
        },
        xp_cost: {
          type: 'integer',
          minimum: 3,
          maximum: 5
        },
        description: {
          $ref: '#/definitions/Description'
        }
      }
    },
    DelveSiteDenizenRarity: {
      enum: [
        'very_common',
        'common',
        'uncommon',
        'rare',
        'unforeseen'
      ]
    },
    DelveSiteDenizen: {
      type: 'object',
      allOf: [
        {
          $ref: '#/definitions/OracleRowLike'
        },
        {
          required: [
            'rarity',
            'encounter'
          ],
          properties: {
            name: {
              description: "A name for the encounter, if it differs from the original entry's default name.",
              $ref: '#/definitions/LocalizedLabel'
            },
            rarity: {
              $ref: '#/definitions/DelveSiteDenizenRarity'
            },
            encounter: {
              default: null,
              oneOf: [
                {
                  $ref: '#/definitions/EncounterClassic.ID'
                },
                {
                  type: 'null'
                }
              ]
            }
          }
        }
      ]
    },
    DelveCardType: {
      type: 'string',
      enum: [
        'theme',
        'domain'
      ]
    },
    DelveCardBase: {
      description: 'Schema shared by delve site themes and delve site domains.',
      type: 'object',
      additionalProperties: false,
      properties: {
        name: {
          $ref: '#/definitions/LocalizedLabel'
        },
        card_type: {
          $ref: '#/definitions/DelveCardType'
        },
        summary: {
          $ref: '#/definitions/Summary'
        },
        description: {
          $ref: '#/definitions/Description'
        },
        source: {
          $ref: '#/definitions/Source'
        },
        features: {
          items: {
            $ref: '#/definitions/OracleTableRow'
          }
        },
        dangers: {
          items: {
            $ref: '#/definitions/OracleTableRow'
          }
        }
      }
    },
    DelveSiteDomain: {
      allOf: [
        {
          $ref: '#/definitions/DelveCardBase'
        },
        {
          properties: {
            card_type: {
              const: 'domain'
            },
            features: {
              additionalItems: false,
              items: [
                {
                  properties: {
                    floor: {
                      const: 21
                    },
                    ceiling: {
                      const: 43
                    }
                  }
                },
                {
                  properties: {
                    floor: {
                      const: 44
                    },
                    ceiling: {
                      const: 56
                    }
                  }
                },
                {
                  properties: {
                    floor: {
                      const: 57
                    },
                    ceiling: {
                      const: 64
                    }
                  }
                },
                {
                  properties: {
                    floor: {
                      const: 65
                    },
                    ceiling: {
                      const: 68
                    }
                  }
                },
                {
                  properties: {
                    floor: {
                      const: 69
                    },
                    ceiling: {
                      const: 72
                    }
                  }
                },
                {
                  properties: {
                    floor: {
                      const: 73
                    },
                    ceiling: {
                      const: 76
                    }
                  }
                },
                {
                  properties: {
                    floor: {
                      const: 77
                    },
                    ceiling: {
                      const: 80
                    }
                  }
                },
                {
                  properties: {
                    floor: {
                      const: 81
                    },
                    ceiling: {
                      const: 84
                    }
                  }
                },
                {
                  properties: {
                    floor: {
                      const: 85
                    },
                    ceiling: {
                      const: 88
                    }
                  }
                }
              ]
            },
            dangers: {
              additionalItems: false,
              items: [
                {
                  properties: {
                    floor: {
                      const: 31
                    },
                    ceiling: {
                      const: 33
                    }
                  }
                },
                {
                  properties: {
                    floor: {
                      const: 34
                    },
                    ceiling: {
                      const: 36
                    }
                  }
                },
                {
                  properties: {
                    floor: {
                      const: 37
                    },
                    ceiling: {
                      const: 39
                    }
                  }
                },
                {
                  properties: {
                    floor: {
                      const: 40
                    },
                    ceiling: {
                      const: 42
                    }
                  }
                },
                {
                  properties: {
                    floor: {
                      const: 43
                    },
                    ceiling: {
                      const: 45
                    }
                  }
                }
              ]
            }
          }
        }
      ]
    },
    DelveSiteTheme: {
      allOf: [
        {
          $ref: '#/definitions/DelveCardBase'
        },
        {
          properties: {
            card_type: {
              const: 'theme'
            },
            features: {
              additionalItems: false,
              items: [
                {
                  properties: {
                    floor: {
                      const: 1
                    },
                    ceiling: {
                      const: 4
                    }
                  }
                },
                {
                  properties: {
                    floor: {
                      const: 5
                    },
                    ceiling: {
                      const: 8
                    }
                  }
                },
                {
                  properties: {
                    floor: {
                      const: 9
                    },
                    ceiling: {
                      const: 12
                    }
                  }
                },
                {
                  properties: {
                    floor: {
                      const: 13
                    },
                    ceiling: {
                      const: 16
                    }
                  }
                },
                {
                  properties: {
                    floor: {
                      const: 17
                    },
                    ceiling: {
                      const: 20
                    }
                  }
                }
              ]
            },
            dangers: {
              additionalItems: false,
              items: [
                {
                  properties: {
                    floor: {
                      const: 1
                    },
                    ceiling: {
                      const: 5
                    }
                  }
                },
                {
                  properties: {
                    floor: {
                      const: 6
                    },
                    ceiling: {
                      const: 10
                    }
                  }
                },
                {
                  properties: {
                    floor: {
                      const: 11
                    },
                    ceiling: {
                      const: 12
                    }
                  }
                },
                {
                  properties: {
                    floor: {
                      const: 13
                    },
                    ceiling: {
                      const: 14
                    }
                  }
                },
                {
                  properties: {
                    floor: {
                      const: 15
                    },
                    ceiling: {
                      const: 16
                    }
                  }
                },
                {
                  properties: {
                    floor: {
                      const: 17
                    },
                    ceiling: {
                      const: 18
                    }
                  }
                },
                {
                  properties: {
                    floor: {
                      const: 19
                    },
                    ceiling: {
                      const: 20
                    }
                  }
                },
                {
                  properties: {
                    floor: {
                      const: 21
                    },
                    ceiling: {
                      const: 22
                    }
                  }
                },
                {
                  properties: {
                    floor: {
                      const: 23
                    },
                    ceiling: {
                      const: 24
                    }
                  }
                },
                {
                  properties: {
                    floor: {
                      const: 25
                    },
                    ceiling: {
                      const: 26
                    }
                  }
                },
                {
                  properties: {
                    floor: {
                      const: 27
                    },
                    ceiling: {
                      const: 28
                    }
                  }
                },
                {
                  properties: {
                    floor: {
                      const: 29
                    },
                    ceiling: {
                      const: 30
                    }
                  }
                }
              ]
            }
          }
        }
      ]
    }
  }
}

export default schema