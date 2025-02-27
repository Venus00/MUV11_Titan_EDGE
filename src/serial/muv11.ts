export const CAN_PAYLOAD  = {
    "0x20": {
        "nombre_grandeurs": 5,
        "grandeurs": [
            {
                "nom": "HYDRAULIC OIL LEVEL",
                "byte": 0,
                "bit": "ALL",
                "type": "USINT",
                "formule": "byte_0",
                "unite": "%"
            },
            {
                "nom": "HYDRAULIC OIL LEVEL LOW",
                "byte": 1,
                "bit": 0,
                "type": "BOOL",
                "formule": "(byte_1 & (1 << 0)) != 0",
                "unite": " "
            },
            {
                "nom": "BEACON LAMP",
                "byte": 1,
                "bit": 1,
                "type": "BOOL",
                "formule": "(byte_1 & (1 << 1)) != 0",
                "unite": " "
            },
            {
                "nom": "BATTERY VOLTAGE",
                "byte": [2, 3],
                "bit": "ALL",
                "type": "FLOAT",
                "formule": "(byte_3 + (byte_2 * 256)) * (0.05)",
                "unite": "V"
            },
            {
                "nom": "FUEL PRESSURE",
                "byte": 7,
                "bit": "ALL",
                "type": "FLOAT",
                "formule": "(byte_7 * 4)",
                "unite": "kPa"
            }
        ]
    },
    "0x30": {
        "nombre_grandeurs": 5,
        "grandeurs": [
            {
                "nom": "ENGINE OIL PRESSURE",
                "byte": 0,
                "bit": "ALL",
                "type": "FLOAT",
                "formule": "(byte_0 * 4)",
                "unite": "kPa"
            },
            {
                "nom": "ENGINE COOLANT TEMPERATURE",
                "byte": 1,
                "bit": "ALL",
                "type": "FLOAT",
                "formule": "(byte_1 - 40)",
                "unite": "°C"
            },
            {
                "nom": "FRONT AXLE ACCUMULATOR PRESSURE",
                "byte": 5,
                "bit": "ALL",
                "type": "USINT",
                "formule": "byte_5",
                "unite": "bar"
            },
            {
                "nom": "FRONT AXLE SERVICE PRESSURE",
                "byte": 6,
                "bit": "ALL",
                "type": "USINT",
                "formule": "byte_6",
                "unite": "bar"
            },
            {
                "nom": "PARKING BRAKE ACCUMULATOR PRESSURE",
                "byte": 7,
                "bit": "ALL",
                "type": "USINT",
                "formule": "byte_7",
                "unite": "bar"
            }
        ]
    },
    "0x40": {
        "nombre_grandeurs": 34,
        "grandeurs": [
          {
            "nom": "LEFT SIGNAL",
            "byte": 0,
            "bit": 0,
            "type": "BOOL",
            "formule": "(byte_0 & (1 << 0)) != 0",
            "unite": " "
          },
          {
            "nom": "RIGHT SIGNAL",
            "byte": 0,
            "bit": 1,
            "type": "BOOL",
            "formule": "(byte_0 & (1 << 1)) != 0",
            "unite": " "
          },
          {
            "nom": "HEADLIGHT FLASHER",
            "byte": 0,
            "bit": 2,
            "type": "BOOL",
            "formule": "(byte_0 & (1 << 2)) != 0",
            "unite": " "
          },
          {
            "nom": "HYDRAULIC OIL TEMP HIGH",
            "byte": 0,
            "bit": 3,
            "type": "BOOL",
            "formule": "(byte_0 & (1 << 3)) != 0",
            "unite": " "
          },
          {
            "nom": "FLASHER",
            "byte": 0,
            "bit": 4,
            "type": "BOOL",
            "formule": "(byte_0 & (1 << 4)) != 0",
            "unite": " "
          },
          {
            "nom": "HEADLIGHT",
            "byte": 0,
            "bit": 5,
            "type": "BOOL",
            "formule": "(byte_0 & (1 << 5)) != 0",
            "unite": " "
          },
          {
            "nom": "REVERSE SIGNAL",
            "byte": 0,
            "bit": 6,
            "type": "BOOL",
            "formule": "(byte_0 & (1 << 6)) != 0",
            "unite": " "
          },
          {
            "nom": "CAN_DOOR_SENSOR",
            "byte": 0,
            "bit": 7,
            "type": "BOOL",
            "formule": "(byte_0 & (1 << 7)) != 0",
            "unite": " "
          },
          {
            "nom": "APC AUTOMATIC",
            "byte": 1,
            "bit": 0,
            "type": "BOOL",
            "formule": "(byte_1 & (1 << 0)) != 0",
            "unite": " "
          },
          {
            "nom": "APC MANUAL",
            "byte": 1,
            "bit": 1,
            "type": "BOOL",
            "formule": "(byte_1 & (1 << 1)) != 0",
            "unite": " "
          },
          {
            "nom": "APC ACTIVE FAULT",
            "byte": 1,
            "bit": 2,
            "type": "BOOL",
            "formule": "(byte_1 & (1 << 2)) != 0",
            "unite": " "
          },
          {
            "nom": "GEAR 1",
            "byte": 1,
            "bit": 3,
            "type": "BOOL",
            "formule": "(byte_1 & (1 << 3)) != 0",
            "unite": " "
          },
          {
            "nom": "GEAR 2",
            "byte": 1,
            "bit": 4,
            "type": "BOOL",
            "formule": "(byte_1 & (1 << 4)) != 0",
            "unite": " "
          },
          {
            "nom": "GEAR 3",
            "byte": 1,
            "bit": 5,
            "type": "BOOL",
            "formule": "(byte_1 & (1 << 5)) != 0",
            "unite": " "
          },
          {
            "nom": "GEAR 4",
            "byte": 1,
            "bit": 6,
            "type": "BOOL",
            "formule": "(byte_1 & (1 << 6)) != 0",
            "unite": " "
          },
          {
            "nom": "PARKING BRAKE ACTIVE",
            "byte": 1,
            "bit": 7,
            "type": "BOOL",
            "formule": "(byte_1 & (1 << 7)) != 0",
            "unite": " "
          },
          {
            "nom": "VEHICLE SPEED",
            "byte": 2,
            "bit": "ALL",
            "type": "USINT",
            "formule": "byte_2",
            "unite": "Km/h"
          },
          {
            "nom": "GEAR NEUTRAL",
            "byte": 3,
            "bit": 0,
            "type": "BOOL",
            "formule": "(byte_3 & (1 << 0)) != 0",
            "unite": " "
          },
          {
            "nom": "GEAR REVERSE",
            "byte": 3,
            "bit": 1,
            "type": "BOOL",
            "formule": "(byte_3 & (1 << 1)) != 0",
            "unite": " "
          },
          {
            "nom": "GEAR FORWARD",
            "byte": 3,
            "bit": 2,
            "type": "BOOL",
            "formule": "(byte_3 & (1 << 2)) != 0",
            "unite": " "
          },
          {
            "nom": "FRONT WORKING LAMP",
            "byte": 3,
            "bit": 3,
            "type": "BOOL",
            "formule": "(byte_3 & (1 << 3)) != 0",
            "unite": " "
          },
          {
            "nom": "REAR WORKING LAMP",
            "byte": 3,
            "bit": 4,
            "type": "BOOL",
            "formule": "(byte_3 & (1 << 4)) != 0",
            "unite": " "
          },
          {
            "nom": "FRONT FOG LAMP",
            "byte": 3,
            "bit": 5,
            "type": "BOOL",
            "formule": "(byte_3 & (1 << 5)) != 0",
            "unite": " "
          },
          {
            "nom": "REAR FOG LAMP",
            "byte": 3,
            "bit": 6,
            "type": "BOOL",
            "formule": "(byte_3 & (1 << 6)) != 0",
            "unite": " "
          },
          {
            "nom": "SEAT BELT",
            "byte": 3,
            "bit": 7,
            "type": "BOOL",
            "formule": "(byte_3 & (1 << 7)) != 0",
            "unite": " "
          },
          {
            "nom": "TRANSMISSION PRESSURE",
            "byte": 4,
            "bit": "ALL",
            "type": "USINT",
            "formule": "byte_4",
            "unite": "bar"
          },
          {
            "nom": "TRANSMISSION TEMP",
            "byte": 5,
            "bit": "ALL",
            "type": "USINT",
            "formule": "byte_5",
            "unite": "°C"
          },
          {
            "nom": "FUEL LEVEL",
            "byte": 6,
            "bit": "ALL",
            "type": "USINT",
            "formule": "byte_6",
            "unite": "%"
          },
          {
            "nom": "FUEL LOW SIGNAL",
            "byte": 7,
            "bit": 0,
            "type": "BOOL",
            "formule": "(byte_7 & (1 << 0)) != 0",
            "unite": " "
          },
          {
            "nom": "WATER IN FUEL",
            "byte": 7,
            "bit": 1,
            "type": "BOOL",
            "formule": "(byte_7 & (1 << 1)) != 0",
            "unite": " "
          },
          {
            "nom": "ENGINE MALFUNCTION SIGNAL",
            "byte": 7,
            "bit": 2,
            "type": "BOOL",
            "formule": "(byte_7 & (1 << 2)) != 0",
            "unite": " "
          },
          {
            "nom": "COOLANT TEMP SENSOR MALFUNCTION",
            "byte": 7,
            "bit": 3,
            "type": "BOOL",
            "formule": "(byte_7 & (1 << 3)) != 0",
            "unite": " "
          },
          {
            "nom": "ENGINE OIL LEVEL LOW",
            "byte": 7,
            "bit": 4,
            "type": "BOOL",
            "formule": "(byte_7 & (1 << 4)) != 0",
            "unite": " "
          },
          {
            "nom": "PRE-HEAT",
            "byte": 7,
            "bit": 6,
            "type": "BOOL",
            "formule": "(byte_7 & (1 << 6)) != 0",
            "unite" : " "
          }
        ]
      },
      "0x50": {
        "nombre_grandeurs": 4,
        "grandeurs": [
          {
            "nom": "DOOR SENSOR",
            "byte": 0,
            "bit": 0,
            "type": "BOOL",
            "formule": "(byte_0 & (1 << 0)) != 0",
            "unite": " "
          },
          {
            "nom": "DIFFERENTIAL LOCKED WARNING",
            "byte": 0,
            "bit": 2,
            "type": "BOOL",
            "formule": "(byte_0 & (1 << 2)) != 0",
            "unite": " "
          },
          {
            "nom": "HYDRAULIC OIL TEMPERATURE",
            "byte": 4,
            "bit": "ALL",
            "type": "USINT",
            "formule": "byte_4",
            "unite": "°C"
          },
          {
            "nom": "AMBIENT TEMPERATURE",
            "byte": 6,
            "bit": "ALL",
            "type": "USINT",
            "formule": "byte_6",
            "unite" : "°C"
          }
        ]
      },
      "0x70": {
        "nombre_grandeurs": 2,
        "grandeurs": [
          {
            "nom": "TRANSMISSION OIL PRESSURE LOW",
            "byte": 0,
            "bit": 2,
            "type": "BOOL",
            "formule": "(byte_0 & (1 << 2)) != 0",
            "unite": " "
          },
          {
            "nom": "TRANSMISSION OIL TEMP HIGH",
            "byte": 0,
            "bit": 3,
            "type": "BOOL",
            "formule": "(byte_0 & (1 << 3)) != 0",
            "unite" : " "
          }
        ]
      },
        "0x80": {
            "nombre_grandeurs": 7,
            "grandeurs": [
            {
                "nom": "ENGINE WORKING HOUR",
                "byte": [0, 1, 2, 3],
                "bit": "ALL",
                "type": "FLOAT",
                "formule": "(byte_0 + (byte_1 * (2**8)) + (byte_2 * (2**16)) + (byte_3 * (2**24))) * (0.05)",
                "unite" : "h"
            },
            {
                "nom": "ENGINE SPEED",
                "byte": [4, 5],
                "bit": "ALL",
                "type": "FLOAT",
                "formule": "(byte_4 + (byte_5 * (2**8))) * (0.125)",
                "unite" : "rpm"
            },
            {
                "nom": "DIFFERANCIAL LOCK",
                "byte": 7,
                "bit": 0,
                "type": "BOOL",
                "formule": "(byte_7 & (1 << 0)) != 0",
                "unite" : " "
            },
            {
                "nom": "WINDOW RESISTANCE",
                "byte": 7,
                "bit": 1,
                "type": "BOOL",
                "formule": "(byte_7 & (1 << 1)) != 0",
                "unite" : " "
            },
            {
                "nom": "POWERPACK",
                "byte": 7,
                "bit": 2,
                "type": "BOOL",
                "formule": "(byte_7 & (1 << 2)) != 0",
                "unite" : " "
            },
            {
                "nom": "REVERSE DOOR",
                "byte": 7,
                "bit": 3,
                "type": "BOOL",
                "formule": "(byte_7 & (1 << 3)) != 0",
                "unite" : " "
            },
            {
                "nom": "STOP WARNING",
                "byte": 7,
                "bit": 4,
                "type": "BOOL",
                "formule": "(byte_7 & (1 << 4)) != 0",
                "unite" : " "
            }
            ]
        },
      "0x90": {
        "nombre_grandeurs": 10,
        "grandeurs": [
          {
            "nom": "REAR AXLE ACCUMULATOR PRESSURE",
            "byte": 0,
            "bit": "ALL",
            "type": "USINT",
            "formule": "byte_0",
            "unite": "bar"
          },
          {
            "nom": "REAR AXLE SERVICE PRESSURE",
            "byte": 1,
            "bit": "ALL",
            "type": "USINT",
            "formule": "byte_1",
            "unite": "bar"
          },
          {
            "nom": "PARKING BRAKE SERVICE PRESSURE",
            "byte": 2,
            "bit": "ALL",
            "type": "USINT",
            "formule": "byte_2",
            "unite": "bar"
          },
          {
            "nom": "FRONT AXLE ACCUMULATOR SENSOR FAULT",
            "byte": 3,
            "bit": 0,
            "type": "BOOL",
            "formule": "(byte_3 & (1 << 0)) != 0",
            "unite": " "
          },
          {
            "nom": "REAR AXLE ACCUMULATOR SENSOR FAULT",
            "byte": 3,
            "bit": 1,
            "type": "BOOL",
            "formule": "(byte_3 & (1 << 1)) != 0",
            "unite": " "
          },
          {
            "nom": "PARKING BREAK ACCUMULATOR SENSOR FAULT",
            "byte": 3,
            "bit": 2,
            "type": "BOOL",
            "formule": "(byte_3 & (1 << 2)) != 0",
            "unite": " "
          },
          {
            "nom": "SERVICE BREAK SENSORS FAULT",
            "byte": 3,
            "bit": 3,
            "type": "BOOL",
            "formule": "(byte_3 & (1 << 3)) != 0",
            "unite": " "
          },
          {
            "nom": "TRANSMISSION PRESSURE SENSOR FAULT",
            "byte": 5,
            "bit": 3,
            "type": "BOOL",
            "formule": "(byte_5 & (1 << 3)) != 0",
            "unite": " "
          },
          {
            "nom": "FRONT AXLE SERVICE SENSOR FAULT",
            "byte": 5,
            "bit": 4,
            "type": "BOOL",
            "formule": "(byte_5 & (1 << 4)) != 0",
            "unite": " "
          },
          {
            "nom": "REAR AXLE SERVICE SENSOR FAULT",
            "byte": 5,
            "bit": 5,
            "type": "BOOL",
            "formule": "(byte_5 & (1 << 5)) != 0",
            "unite": " "
          },
          {
            "nom": "PARKING BREAK SERVICE SENSOR FAULT",
            "byte": 5,
            "bit": 6,
            "type": "BOOL",
            "formule": "(byte_5 & (1 << 6)) != 0",
            "unite" : " "
          }
        ]
      },
      "0x1200": {
        "nombre_grandeurs": 2,
        "grandeurs": [
          {
            "nom": "SPN 1 FAULT CODE",
            "byte": [0, 1, 2, 3],
            "bit": "ALL",
            "type": "DWORD",
            "formule": "(byte_3 * (256**3)) + (byte_2 * (256**2)) + (byte_1 * (256**1)) + (byte_0 * (256**0))",
            "unite": " "
          },
          {
            "nom": "SPN 2 FAULT CODE",
            "byte": [4, 5, 6, 7],
            "bit": "ALL",
            "type": "DWORD",
            "formule": "(byte_7 * (256**3)) + (byte_6 * (256**2)) + (byte_5 * (256**1)) + (byte_4 * (256**0))",
            "unite" : " "
          }
        ]
      },
      "0x1300": {
        "nombre_grandeurs": 2,
        "grandeurs": [
          {
            "nom": "SPN 3 FAULT CODE",
            "byte": [0, 1, 2, 3],
            "bit": "ALL",
            "type": "DWORD",
            "formule": "(byte_3 * (256**3)) + (byte_2 * (256**2)) + (byte_1 * (256**1)) + (byte_0 * (256**0))",
            "unite": " "
          },
          {
            "nom": "SPN 4 FAULT CODE",
            "byte": [4, 5, 6, 7],
            "bit": "ALL",
            "type": "DWORD",
            "formule": "(byte_7 * (256**3)) + (byte_6 * (256**2)) + (byte_5 * (256**1)) + (byte_4 * (256**0))",
            "unite" : " "
          }
        ]
      },
      "0x1400": {
        "nombre_grandeurs": 2,
        "grandeurs": [
          {
            "nom": "SPN 5 FAULT CODE",
            "byte": [0, 1, 2, 3],
            "bit": "ALL",
            "type": "DWORD",
            "formule": "(byte_3 * (256**3)) + (byte_2 * (256**2)) + (byte_1 * (256**1)) + (byte_0 * (256**0))",
            "unite": " "
          },
          {
            "nom": "SPN 6 FAULT CODE",
            "byte": [4, 5, 6, 7],
            "bit": "ALL",
            "type": "DWORD",
            "formule": "(byte_7 * (256**3)) + (byte_6 * (256**2)) + (byte_5 * (256**1)) + (byte_4 * (256**0))",
            "unite" : " "
          }
        ]
      },
      "0x1500": {
        "nombre_grandeurs": 6,
        "grandeurs": [
          {
            "nom": "FMI 1 FAULT CODE",
            "byte": 0,
            "bit": "ALL",
            "type": "USINT",
            "formule": "byte_0",
            "unite": " "
          },
          {
            "nom": "FMI 2 FAULT CODE",
            "byte": 1,
            "bit": "ALL",
            "type": "USINT",
            "formule": "byte_1",
            "unite": " "
          },
          {
            "nom": "FMI 3 FAULT CODE",
            "byte": 2,
            "bit": "ALL",
            "type": "USINT",
            "formule": "byte_2",
            "unite": " "
          },
          {
            "nom": "FMI 4 FAULT CODE",
            "byte": 3,
            "bit": "ALL",
            "type": "USINT",
            "formule": "byte_3",
            "unite": " "
          },
          {
            "nom": "FMI 5 FAULT CODE",
            "byte": 4,
            "bit": "ALL",
            "type": "USINT",
            "formule": "byte_4",
            "unite": " "
          },
          {
            "nom": "FMI 6 FAULT CODE",
            "byte": 5,
            "bit": "ALL",
            "type": "USINT",
            "formule": "byte_5",
            "unite" : " "
          }
        ]
      }      
  }
  