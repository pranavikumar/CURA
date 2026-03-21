// Mock data for AXON demo

export interface DrugInfo {
  name: string;
  genericName: string;
  class: string;
  mechanism: string;
  indications: string[];
  contraindications: string[];
  adverseEffects: string[];
  dosage: string;
  interactions: string[];
}

export interface DiseaseInfo {
  name: string;
  symptoms: string[];
  pathophysiology: string;
  diagnosis: string;
  treatment: string;
}

export interface AnkiCard {
  id: string;
  front: string;
  back: string;
  tags: string[];
  difficulty: number;
}

export interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  /** Flashcard this question was generated from (weak-area targeting). */
  sourceCardId?: string;
}

export const MOCK_DRUGS: Record<string, DrugInfo> = {
  metoprolol: {
    name: "Metoprolol",
    genericName: "Metoprolol tartrate/succinate",
    class: "Beta-1 selective blocker",
    mechanism: "Selective blockade of β1-adrenergic receptors in cardiac tissue, reducing heart rate, contractility, and blood pressure",
    indications: [
      "Hypertension",
      "Angina pectoris",
      "Acute myocardial infarction",
      "Heart failure with reduced ejection fraction",
      "Atrial fibrillation (rate control)"
    ],
    contraindications: [
      "Severe bradycardia (<45 bpm)",
      "Second or third-degree AV block",
      "Cardiogenic shock",
      "Decompensated heart failure",
      "Severe peripheral arterial disease"
    ],
    adverseEffects: [
      "Bradycardia",
      "Fatigue",
      "Cold extremities",
      "Bronchospasm (less common than non-selective β-blockers)",
      "Masking of hypoglycemia symptoms in diabetics"
    ],
    dosage: "25-100mg PO BID (immediate release) or 25-200mg PO daily (extended release)",
    interactions: [
      "Calcium channel blockers (increased risk of bradycardia/heart block)",
      "Digoxin (additive bradycardia)",
      "Insulin/oral hypoglycemics (may mask hypoglycemia)"
    ]
  },
  lisinopril: {
    name: "Lisinopril",
    genericName: "Lisinopril",
    class: "ACE Inhibitor",
    mechanism: "Inhibits angiotensin-converting enzyme, preventing conversion of angiotensin I to angiotensin II, resulting in decreased aldosterone secretion",
    indications: [
      "Hypertension",
      "Heart failure",
      "Post-myocardial infarction",
      "Diabetic nephropathy"
    ],
    contraindications: [
      "Pregnancy (teratogenic)",
      "Bilateral renal artery stenosis",
      "History of angioedema with ACE inhibitors",
      "Concurrent use with aliskiren in diabetics"
    ],
    adverseEffects: [
      "Dry cough (10-15% of patients)",
      "Hyperkalemia",
      "Angioedema (rare but serious)",
      "Hypotension",
      "Acute kidney injury",
      "Dizziness"
    ],
    dosage: "10-40mg PO daily",
    interactions: [
      "Potassium-sparing diuretics (hyperkalemia risk)",
      "NSAIDs (reduced antihypertensive effect, AKI risk)",
      "Lithium (increased lithium levels)"
    ]
  },
  warfarin: {
    name: "Warfarin",
    genericName: "Warfarin sodium",
    class: "Vitamin K antagonist (anticoagulant)",
    mechanism: "Inhibits vitamin K epoxide reductase, preventing synthesis of vitamin K-dependent clotting factors (II, VII, IX, X) and proteins C & S",
    indications: [
      "Atrial fibrillation (stroke prevention)",
      "Venous thromboembolism (DVT/PE)",
      "Mechanical heart valves",
      "Post-MI in selected cases"
    ],
    contraindications: [
      "Active bleeding",
      "Pregnancy (teratogenic)",
      "Severe liver disease",
      "Recent CNS/eye surgery",
      "Inability to monitor INR reliably"
    ],
    adverseEffects: [
      "Bleeding (major and minor)",
      "Skin necrosis (rare, due to protein C deficiency)",
      "Purple toe syndrome",
      "Teratogenicity (fetal warfarin syndrome)"
    ],
    dosage: "Variable, typically 2-10mg daily, titrated to INR goal (usually 2-3)",
    interactions: [
      "Multiple drug-drug interactions via CYP2C9",
      "Antibiotics (especially metronidazole, trimethoprim)",
      "Amiodarone (increases INR)",
      "Vitamin K-rich foods (decreases INR)",
      "NSAIDs/aspirin (increased bleeding risk)"
    ]
  }
};

export const MOCK_DISEASES: Record<string, DiseaseInfo> = {
  "congestive heart failure": {
    name: "Congestive Heart Failure",
    symptoms: [
      "Dyspnea on exertion progressing to orthopnea and PND",
      "Bilateral lower extremity edema",
      "Jugular venous distension",
      "S3 gallop on auscultation",
      "Bibasilar crackles",
      "Fatigue and exercise intolerance"
    ],
    pathophysiology: "Reduced cardiac output leads to neurohormonal activation (RAAS, SNS), causing sodium/water retention and increased afterload. Can be systolic (HFrEF, EF <40%) or diastolic (HFpEF, EF >50%).",
    diagnosis: "BNP >100 pg/mL or NT-proBNP >300 pg/mL. Echo shows reduced EF or diastolic dysfunction. CXR may show pulmonary edema, cardiomegaly, cephalization.",
    treatment: "GDMT for HFrEF: ACE-I/ARB/ARNI, β-blocker, mineralocorticoid antagonist, SGLT2i. Diuretics for volume overload. Consider ICD/CRT in selected patients."
  },
  "myocardial infarction": {
    name: "Myocardial Infarction",
    symptoms: [
      "Substernal chest pain radiating to left arm/jaw",
      "Diaphoresis",
      "Nausea/vomiting",
      "Dyspnea",
      "May present atypically in elderly/diabetics/women"
    ],
    pathophysiology: "Acute coronary artery occlusion (usually from plaque rupture + thrombosis) causes myocardial ischemia and necrosis. STEMI = transmural infarction; NSTEMI = subendocardial.",
    diagnosis: "ECG: STEMI shows ST elevation in contiguous leads. Cardiac biomarkers: troponin elevation. Coronary angiography identifies culprit lesion.",
    treatment: "STEMI: immediate reperfusion (PCI <90min or fibrinolysis <30min). NSTEMI: antiplatelet therapy, anticoagulation, risk stratification. All MI: DAPT, statin, β-blocker, ACE-I."
  },
  "atrial fibrillation": {
    name: "Atrial Fibrillation",
    symptoms: [
      "Palpitations",
      "Irregular pulse",
      "Dyspnea",
      "Fatigue",
      "May be asymptomatic"
    ],
    pathophysiology: "Chaotic atrial electrical activity with irregular ventricular response. Loss of atrial kick reduces cardiac output by 20-30%. Atrial stasis increases stroke risk.",
    diagnosis: "ECG: irregularly irregular rhythm, absent P waves, fibrillatory waves. May see on telemetry or Holter monitor.",
    treatment: "Rate control (β-blockers, CCB) vs rhythm control (cardioversion, antiarrhythmics). Anticoagulation based on CHA2DS2-VASc score. Consider ablation in refractory cases."
  }
};

export const SAMPLE_ANKI_CARDS: AnkiCard[] = [
  {
    id: "card1",
    front: "A 65-year-old man with history of hypertension and diabetes presents with acute substernal chest pain radiating to his left arm. ECG shows ST elevations in leads II, III, aVF. What is the likely diagnosis and which coronary artery is affected?",
    back: "Inferior STEMI, likely involving the right coronary artery (RCA). The RCA supplies the inferior wall in 80% of cases (right-dominant system).",
    tags: ["cardiology", "ACS", "ECG"],
    difficulty: 0
  },
  {
    id: "card2",
    front: "What is the mechanism of action of Metoprolol? Why is it preferred over non-selective beta blockers in patients with COPD?",
    back: "Metoprolol is a β1-selective blocker that primarily affects cardiac β1 receptors, reducing heart rate and contractility. It's preferred in COPD because it has less effect on β2 receptors in bronchial smooth muscle, reducing bronchospasm risk compared to non-selective β-blockers like propranolol.",
    tags: ["pharmacology", "cardiology", "beta-blockers"],
    difficulty: 2
  },
  {
    id: "card3",
    front: "A patient on warfarin for atrial fibrillation presents with an INR of 8.5 and minor gum bleeding. What is the appropriate management?",
    back: "Hold warfarin, give oral vitamin K 1-2.5mg. Check INR daily until therapeutic. If major bleeding, give 4-factor PCC + vitamin K 10mg IV. FFP is alternative if PCC unavailable.",
    tags: ["pharmacology", "anticoagulation", "warfarin"],
    difficulty: 1
  }
];

export const generatePracticeQuestions = (cardId: string, cardContent: string): PracticeQuestion[] => {
  // Mock question generation based on common medical topics
  const questions: Record<string, PracticeQuestion[]> = {
    card1: [
      {
        id: "pq1a",
        question: "A 58-year-old woman presents with chest pain. ECG shows ST elevations in leads V1-V4. Which coronary artery is most likely affected?",
        options: [
          "Right coronary artery",
          "Left anterior descending artery",
          "Left circumflex artery",
          "Posterior descending artery"
        ],
        correctAnswer: 1,
        explanation: "ST elevations in V1-V4 indicate anterior wall involvement, which is supplied by the LAD. This is the most commonly occluded vessel in MI."
      },
      {
        id: "pq1b",
        question: "What is the maximum door-to-balloon time recommended for STEMI patients when primary PCI is the reperfusion strategy?",
        options: [
          "60 minutes",
          "90 minutes",
          "120 minutes",
          "180 minutes"
        ],
        correctAnswer: 1,
        explanation: "The AHA/ACC guidelines recommend door-to-balloon time ≤90 minutes for STEMI patients undergoing primary PCI."
      },
      {
        id: "pq1c",
        question: "Which of the following is NOT part of initial management for STEMI?",
        options: [
          "Aspirin 325mg",
          "β-blocker (if no contraindications)",
          "Immediate thrombolysis in all cases",
          "High-intensity statin"
        ],
        correctAnswer: 2,
        explanation: "Thrombolysis is only given if PCI is not available within 120 minutes. Primary PCI is preferred when available. All other options are standard STEMI management."
      }
    ],
    card2: [
      {
        id: "pq2a",
        question: "Which of the following beta-blockers is NOT cardioselective?",
        options: [
          "Metoprolol",
          "Atenolol",
          "Propranolol",
          "Bisoprolol"
        ],
        correctAnswer: 2,
        explanation: "Propranolol is a non-selective β-blocker affecting both β1 and β2 receptors. Metoprolol, atenolol, and bisoprolol are β1-selective."
      },
      {
        id: "pq2b",
        question: "A patient on metoprolol develops symptomatic bradycardia with HR 42. What is the mechanism?",
        options: [
          "Increased vagal tone",
          "β1 receptor blockade in SA node",
          "Direct calcium channel blockade",
          "Increased AV nodal refractoriness"
        ],
        correctAnswer: 1,
        explanation: "Metoprolol blocks β1 receptors in the SA node, reducing spontaneous depolarization and heart rate. This is the intended mechanism but can cause excessive bradycardia."
      },
      {
        id: "pq2c",
        question: "Why should beta-blockers be used cautiously in diabetics on insulin?",
        options: [
          "They increase insulin resistance",
          "They mask tachycardia associated with hypoglycemia",
          "They directly lower blood glucose",
          "They increase risk of DKA"
        ],
        correctAnswer: 1,
        explanation: "β-blockers, especially non-selective ones, can mask sympathetic symptoms of hypoglycemia like tachycardia and tremor, making hypoglycemia harder to detect."
      }
    ],
    card3: [
      {
        id: "pq3a",
        question: "Which clotting factor has the shortest half-life and is affected first by warfarin therapy?",
        options: [
          "Factor II (prothrombin)",
          "Factor VII",
          "Factor IX",
          "Factor X"
        ],
        correctAnswer: 1,
        explanation: "Factor VII has the shortest half-life (4-6 hours) and decreases first, which is why INR increases before full anticoagulation is achieved."
      },
      {
        id: "pq3b",
        question: "A patient starting warfarin develops skin necrosis on day 3. What is the mechanism?",
        options: [
          "Allergic reaction",
          "Protein C deficiency with microvascular thrombosis",
          "Direct toxic effect of warfarin",
          "Vitamin K excess"
        ],
        correctAnswer: 1,
        explanation: "Warfarin-induced skin necrosis occurs due to early depletion of protein C (anticoagulant with short half-life), causing a transient prothrombotic state. More common in protein C deficiency."
      },
      {
        id: "pq3c",
        question: "What is the target INR for a patient with a mechanical mitral valve?",
        options: [
          "1.5-2.0",
          "2.0-3.0",
          "2.5-3.5",
          "3.0-4.0"
        ],
        correctAnswer: 2,
        explanation: "Mechanical mitral valves require higher anticoagulation (INR 2.5-3.5) due to higher thrombogenicity compared to mechanical aortic valves (INR 2.0-3.0)."
      }
    ]
  };

  const base = questions[cardId] || questions.card1;
  return base.map((q) => ({ ...q, sourceCardId: cardId }));
};

/**
 * Returns one additional MCQ for the same card after a wrong answer.
 * Prefers questions not already in the session; if all are used, clones one with a new id.
 */
export function nextPracticeQuestionOnWrong(
  cardId: string,
  cardContent: string,
  practiceQuestionsByCard: Record<string, PracticeQuestion[]> | undefined,
  excludeIds: ReadonlySet<string>
): PracticeQuestion | null {
  const fromApi = practiceQuestionsByCard?.[cardId];
  const pool =
    fromApi && fromApi.length > 0
      ? fromApi.map((q) => ({ ...q, sourceCardId: q.sourceCardId ?? cardId }))
      : generatePracticeQuestions(cardId, cardContent);

  const unused = pool.filter((q) => !excludeIds.has(q.id));
  if (unused.length > 0) {
    const pick = unused[Math.floor(Math.random() * unused.length)]!;
    return { ...pick, sourceCardId: pick.sourceCardId ?? cardId };
  }

  const base = pool[Math.floor(Math.random() * pool.length)] ?? pool[0];
  if (!base) return null;
  return {
    ...base,
    id: `${base.id}-retry-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    sourceCardId: base.sourceCardId ?? cardId,
  };
}

export interface AnatomyModel {
  id: string;
  name: string;
  description: string;
  clinicalRelevance: string;
  structures: Array<{
    name: string;
    description: string;
    clinicalPearl: string;
  }>;
}

export const ANATOMY_MODELS: Record<string, AnatomyModel> = {
  heart: {
    id: "heart",
    name: "Human Heart",
    description: "Four-chambered muscular organ responsible for pumping blood throughout the body",
    clinicalRelevance: "Understanding cardiac anatomy is essential for interpreting ECGs, echo findings, and managing cardiovascular disease",
    structures: [
      {
        name: "Right Atrium",
        description: "Receives deoxygenated blood from SVC, IVC, and coronary sinus",
        clinicalPearl: "RA enlargement on CXR appears as increased rightward convexity. On echo, look for RA dilation >4.0cm in atrial fib."
      },
      {
        name: "Right Ventricle",
        description: "Pumps blood to pulmonary circulation via pulmonary artery",
        clinicalPearl: "RV infarction presents with hypotension, elevated JVP, clear lungs. Treat with fluids, avoid nitrates. Look for ST elevation in V4R."
      },
      {
        name: "Left Atrium",
        description: "Receives oxygenated blood from pulmonary veins",
        clinicalPearl: "LA enlargement >4.0cm increases stroke risk in AFib. On CXR, causes double density sign and straightening of left heart border."
      },
      {
        name: "Left Ventricle",
        description: "Pumps oxygenated blood to systemic circulation",
        clinicalPearl: "LV hypertrophy on ECG: increased voltage (S in V1 + R in V5/V6 >35mm). Causes: HTN, AS, HCM. Increased risk of sudden cardiac death in HCM."
      },
      {
        name: "Aortic Valve",
        description: "Tricuspid semilunar valve between LV and aorta",
        clinicalPearl: "AS presents with crescendo-decrescendo murmur. Severe AS: gradient >40mmHg, area <1.0cm². Classic triad: angina, syncope, HF."
      },
      {
        name: "Mitral Valve",
        description: "Bicuspid AV valve with anterior and posterior leaflets",
        clinicalPearl: "MR: holosystolic murmur radiating to axilla. Acute MR (papillary muscle rupture post-MI): pulmonary edema + hypotension, needs urgent surgery."
      }
    ]
  },
  lung: {
    id: "lung",
    name: "Respiratory System",
    description: "Gas exchange organs divided into lobes (R: 3, L: 2)",
    clinicalRelevance: "Essential for understanding pneumonia patterns, PE distribution, and respiratory pathophysiology",
    structures: [
      {
        name: "Right Upper Lobe",
        description: "Contains apical, anterior, and posterior segments",
        clinicalPearl: "TB classically affects RUL (higher O2 tension). Post-primary TB cavitates here. On CXR, look for apical scarring in chronic TB."
      },
      {
        name: "Right Middle Lobe",
        description: "Medial and lateral segments",
        clinicalPearl: "RML syndrome: chronic RML collapse/infection. On CXR, loss of right heart border. Common in elderly with poor cough."
      },
      {
        name: "Left Upper Lobe",
        description: "Includes lingula (analogous to RML)",
        clinicalPearl: "Lingula pneumonia obscures left heart border on CXR (silhouette sign). Think atypicals like mycoplasma in young patients."
      },
      {
        name: "Lower Lobes",
        description: "Posterior segments most dependent",
        clinicalPearl: "Aspiration pneumonia affects RLL > LLL (right main bronchus more vertical). Look for infiltrates in superior segments in supine patients."
      }
    ]
  },
  kidney: {
    id: "kidney",
    name: "Kidney & Nephron",
    description: "Filtration and regulatory organs maintaining fluid/electrolyte balance",
    clinicalRelevance: "Understanding nephron function is key to managing AKI, electrolyte disorders, and hypertension",
    structures: [
      {
        name: "Glomerulus",
        description: "Capillary network where filtration occurs",
        clinicalPearl: "Nephritic syndrome: hematuria, HTN, oliguria (think GN). Nephrotic: proteinuria >3.5g/day, edema, hyperlipidemia (think minimal change in kids)."
      },
      {
        name: "Proximal Tubule",
        description: "Reabsorbs 65% of filtered Na, water, glucose, amino acids",
        clinicalPearl: "Site of action: acetazolamide (carbonic anhydrase inhibitor). Type 2 RTA: proximal HCO3 wasting, urine pH can be <5.5."
      },
      {
        name: "Loop of Henle",
        description: "Creates medullary concentration gradient",
        clinicalPearl: "Loop diuretics (furosemide) work here. Can cause hypokalemia, metabolic alkalosis, hypomagnesemia. Watch for ototoxicity with high doses."
      },
      {
        name: "Distal Tubule",
        description: "Fine-tunes electrolyte reabsorption",
        clinicalPearl: "Thiazides work here. Cause hypokalemia, hyperuricemia (gout), hyperglycemia, hyperlipidemia. Safe in sulfa allergy despite myth."
      },
      {
        name: "Collecting Duct",
        description: "ADH-regulated water reabsorption, aldosterone-mediated Na/K exchange",
        clinicalPearl: "Spironolactone blocks aldosterone here. Useful in HF, cirrhosis. Can cause hyperkalemia, gynecomastia. Type 4 RTA: aldosterone deficiency."
      }
    ]
  }
};
