const randomFeedback = (...feedbacks) => {
  const index = Math.floor(Math.random() * feedbacks.length)
  return feedbacks[index]
}

const generateValue = (...input) => {
  return input.map((e) => Math.round(e)).join(',')
}

const distance = (dx, dy) => {
  return Math.sqrt(dx * dx + dy * dy)
}

export const luker = {
  2021: [
    {
      day: 1,
      title: 'Hjelp nissen å finne sin lue',
      description:
        'Bruk 2 x {forward(100)} og 1 x {left(90)} til å navigere til nisseluen. Bruk {runCode}-knappen til å sjekke om du fikk riktig.',
      type: 'blockly',
      blocklySettings: {
        maxInstances: { forward: 2, left: 1 },
      },
      toolbox: [
        {
          kind: 'label',
          text: 'Dra disse blokkene til arbeidsbenken 👉',
        },
        {
          kind: 'block',
          blockxml:
            '<block type="forward"><value name="DISTANCE"><shadow type="math_number"><field name="NUM">100</field></shadow></value></block>',
          gap: '4px',
          maxBlocks: 1,
        },
        {
          kind: 'block',
          blockxml:
            '<block type="left"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value></block>',
          gap: '4px',
        },
      ],
      blockxml: '',
      showToolbox: false,
      preDefinedCode: `pensize(5*scale)`,
      evaluationCode: `answer = pos(), heading()`,
      //showGrid: true,
      canvasColor: '#cccccc',
      answer: ([[x, y], rot]) => {
        if (Math.round(x) === 100 && Math.round(y) === 100) {
          return {
            correct: true,
            feedback: (
              <>
                Du klarte det! Nå fikk du et lodd <i className="fas fa-ticket-alt" />
              </>
            ),
            value: generateValue(x, y),
          }
        } else if (Math.round(x) === 100 && Math.round(y) === 100) {
          return { feedback: 'Det er veldig nære!', close: true }
        } else if (distance(x, y) > 110) {
          return { feedback: 'Oisann, det var kanskje litt for langt!', close: true }
        } else if (Math.round(x) === 0 && Math.round(y) === 0) {
          if (rot !== 0) {
            return {
              hint: true,
              feedback: 'Nå mangler du bare to fremover-blokker',
              close: true,
            }
          }
          return {
            hint: true,
            feedback:
              'Prøv å dra en av blokkene til arbeidsbenken (det hvite område med prikker på). Trykk så på den grønne knappen.',
            close: true,
          }
        } else {
          return {
            feedback: randomFeedback('Nissen er litt langt unna sin lue fortsatt', 'Dette klarer du!'),
          }
        }
      },
    },
    {
      day: 2,
      title: 'Start gavemaskinen',
      description:
        'Hva er vel en jul uten gaver? Hjelp nissen med å finne frem til gavemaskinen slik at han kan starte den. Jeg synes å huske den så noe ut som denne: {gavemaskin}',
      type: 'blockly',
      blocks: [
        {
          type: 'block',
        },
      ],
      evaluationCode: `answer = 321`,
      answers: [122131232],
    },
  ],
}
