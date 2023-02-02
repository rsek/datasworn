import { JSONSchema7Definition, JSONSchema7 } from 'json-schema'

export const MoveExtension: JSONSchema7Definition = {
  title: 'MoveExtension',
  allOf: [
    {
      $ref: '#/definitions/MoveExtensionBase'
    },
    {
      required: [
        '_moves'
      ],
      properties: {
        _moves: {
          $ref: '#/definitions/MoveExtensionBase/properties/_moves'
        }
      }
    }
  ]
}

export const MoveExtensionBase: JSONSchema7Definition = {
  description: 'Describes changes made to moves by asset abilities.',
  type: 'object',
  properties: {
    _moves: {
      description: "The s.ID of the affected moves. Use 'null' if it can apply to any move.",
      type: [
        'array',
        'null'
      ],
      items: {
        $ref: '#/definitions/Move.ID'
      },
      default: null
    },
    trigger: {
      $ref: '#/definitions/MoveTrigger'
    }
  }
}

export const MoveCategory: JSONSchema7Definition = {
  title: 'MoveCategory',
  type: 'object',
  properties: {
    title: {
      $ref: '#/definitions/Title'
    },
    color: {
      $ref: '#/definitions/Color'
    },
    description: {
      $ref: '#/definitions/Description'
    },
    source: {
      $ref: '#/definitions/Source'
    },
    moves: {
      patternProperties: {
        '^[a-z][a-z_+]*[a-z]$': {
          $ref: '#/definitions/Move'
        }
      }
    }
  }
}

const schema: JSONSchema7 = {
  definitions: {
    MoveCategory,
    MoveCategories: {
      title: 'MoveCategories',
      additionalProperties: false,
      patternProperties: {
        '^[a-z][a-z_+]*[a-z]$': { $ref: '#/definitions/MoveCategory' }
      }
    },
    Move: {
      type: 'object',
      properties: {
        name: {
          $ref: '#/definitions/LocalizedLabel'
        },
        trigger: {
          $ref: '#/definitions/MoveTrigger'
        },
        attributes: {
          type: 'object',
          patternProperties: {
            '^[a-z][a-z_+]*[a-z]$': {
              $ref: '#/definitions/CustomStat'
            }
          }
        },
        outcomes: {
          $ref: '#/definitions/MoveOutcomes'
        },
        text: {
          $ref: '#/definitions/LocalizedMarkdown'
        },
        suggestions: {
          $ref: '#/definitions/Suggestions'
        },
        asset: {
          description: 'The ID of the parent Asset of the move, if any.',
          $ref: '#/definitions/Asset.ID'
        },
        progress_move: {
          description: 'Whether or not the move is a Progress Move. Progress moves roll two challenge dice against a progress score.',
          type: 'boolean'
        },
        variant_of: {
          description: 'The ID of the move that this move is a variant of, if any.',
          type: 'string'
        },
        oracles: {
          description: 'The s.ID of any oracles directly referenced by the move, or vice versa.',
          type: 'array',
          items: {
            $ref: '#/definitions/Dataforged.ID'
          }
        },
        optional: {
          description: 'Whether or not the source material presents this rules item as optional.',
          default: false,
          type: 'boolean'
        },
        tags: {
          description: "Arbitrary strings tags that describe optional metadata that doesn't fit in other properties.",
          type: 'array',
          items: {
            type: 'string'
          }
        },
        category: {
          description: "The ID of the move's category.",
          type: 'string'
        },
        source: {
          $ref: '#/definitions/Source'
        }
      },
      additionalProperties: false,
      required: [
        'text',
        'name',
        'trigger'
      ]
    },
    MoveTriggerOptionAction: {
      allOf: [
        {
          $ref: '#/definitions/MoveTriggerOption'
        },
        {
          properties: {
            using: {
              type: 'array',
              items: {
                anyOf: [
                  {
                    $ref: '#/definitions/PlayerStat.ID'
                  },
                  {
                    $ref: '#/definitions/PlayerConditionMeter.ID'
                  },
                  {
                    $ref: '#/definitions/ConditionMeterAlias'
                  },
                  {
                    $ref: '#/definitions/Attribute.ID'
                  }
                ]
              }
            },
            roll_type: {
              const: 'action_roll'
            }
          }
        }
      ]
    },
    MoveTriggerOptionProgress: {
      allOf: [
        {
          $ref: '#/definitions/MoveTriggerOption'
        },
        {
          properties: {
            using: {
              type: 'array',
              items: {
                $ref: '#/definitions/ProgressTrackType'
              }
            },
            roll_type: {
              const: 'progress_roll'
            }
          }
        }
      ]
    },
    MoveOutcomeType: {
      enum: [
        'miss',
        'weak_hit',
        'strong_hit'
      ]
    },
    MoveOutcomeWithMatch: {
      allOf: [
        {
          $ref: '#/definitions/MoveOutcome'
        },
        {
          properties: {
            match: {
              $ref: '#/definitions/MoveOutcome'
            }
          }
        }
      ]
    },
    MoveOutcome: {
      properties: {
        text: {
          $ref: '#/definitions/LocalizedMarkdown'
        }
      }
    },
    MoveOutcomes: {
      properties: {
        miss: {
          $ref: '#/definitions/MoveOutcomeWithMatch'
        },
        weak_hit: {
          $ref: '#/definitions/MoveOutcome'
        },
        strong_hit: {
          $ref: '#/definitions/MoveOutcomeWithMatch'
        }
      }
    },
    MoveTriggerOption: {
      properties: {
        method: {
          $ref: '#/definitions/SnakeCase',
          title: 'RollMethod',
          type: 'string',
          description: "The method this move trigger uses to select which stat(s) or progress track(s) are rolled.\n\n`any`: When rolling with this move trigger option, the user picks which stat to use.\n\n`all`: When rolling with this move trigger option, *every* stat or progress track of the `using` key is rolled.\n\n`highest`: When rolling with this move trigger option, use the highest/best option from the `using` key.\n\n`lowest`: When rolling with this move trigger option, use the lowest/worst option from the `using` key.\n\n`inherit`: This move trigger option has no roll method of its own, and must inherit its roll from another move trigger option. If the parent's `Using` is defined, the inherited roll must use one of those stats/progress tracks.\n\n`strong_hit`: The move trigger option results in an automatic strong hit - no roll required.\n\n`weak_hit`: The move trigger option results in an automatic weak hit - no roll required.\n\n`miss`: The move trigger options results in an automatic miss - no roll required.",
          default: 'any',
          enum: [
            'all',
            'any',
            'highest',
            'inherit',
            'lowest',
            'strong_hit',
            'weak_hit',
            'miss'
          ]
        },
        text: {
          $ref: '#/definitions/LocalizedMarkdown'
        },
        using: {
          type: 'array',
          description: 'The stat(s) or progress track(s) that may be rolled with this move trigger option.',
          items: {
            type: 'string'
          }
        },
        roll_type: {
          title: 'RollType',
          $ref: '#/definitions/SnakeCase',
          enum: [
            'action_roll',
            'progress_roll'
          ]
        }
      }
    },
    MoveTrigger: {
      title: 'MoveTrigger',
      type: 'object',
      properties: {
        options: {
          type: 'array',
          oneOf: [
            {
              items: {
                $ref: '#/definitions/MoveTriggerOptionAction'
              }
            },
            {
              items: {
                $ref: '#/definitions/MoveTriggerOptionProgress'
              }
            }
          ]
        },
        text: {
          description: 'A markdown string containing the primary trigger text for this move.\n\nSecondary triggers (for specific stats or uses of an asset ability) are described in `Options`.',
          type: 'string'
        },
        by: {
          description: "Information on who can trigger this item. Usually this is just the player, but some asset abilities can trigger from an Ally's move.",
          additionalProperties: false,
          properties: {
            player: {
              type: 'boolean',
              default: 'true'
            },
            ally: {
              type: 'boolean',
              default: 'false'
            }
          }
        }
      },
      additionalProperties: false
    }
  }
}

export default schema