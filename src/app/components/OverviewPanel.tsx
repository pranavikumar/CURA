import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { BookOpen, AlertCircle } from "lucide-react";
import type { DiseaseInfo } from "../data/mockData";

interface OverviewPanelProps {
  cardText: string;
  disease?: DiseaseInfo;
}

export function OverviewPanel({ cardText, disease }: OverviewPanelProps) {
  // Extract key medical terms and concepts from the card
  const extractKeyConcepts = (text: string): Array<{ term: string; definition: string }> => {
    const concepts: Array<{ term: string; definition: string }> = [];
    const lowerText = text.toLowerCase();

    // Common medical concepts and their definitions
    const medicalTerms: Record<string, string> = {
      "beta blocker": "A class of medications that reduce blood pressure by blocking the effects of epinephrine (adrenaline) on beta-adrenergic receptors.",
      "ace inhibitor": "Angiotensin-Converting Enzyme inhibitor - prevents the formation of angiotensin II, leading to vasodilation and decreased blood pressure.",
      "hypertension": "High blood pressure - sustained elevation of systolic BP ≥130 mmHg or diastolic BP ≥80 mmHg.",
      "angina": "Chest pain or discomfort caused by reduced blood flow to the heart muscle, typically due to coronary artery disease.",
      "myocardial infarction": "Heart attack - death of heart muscle tissue due to lack of blood supply, usually from coronary artery blockage.",
      "heart failure": "Condition where the heart cannot pump enough blood to meet the body's needs, leading to fluid buildup and reduced exercise tolerance.",
      "atrial fibrillation": "Irregular, often rapid heart rhythm originating in the atria, increasing stroke risk due to blood stasis and clot formation.",
      "bradycardia": "Abnormally slow heart rate, typically defined as less than 60 beats per minute in adults.",
      "tachycardia": "Abnormally fast heart rate, typically greater than 100 beats per minute at rest.",
      "anticoagulant": "Medication that prevents blood clot formation by interfering with the coagulation cascade.",
      "thrombus": "Blood clot that forms within a blood vessel and remains attached to its place of origin.",
      "embolus": "Blood clot or other material that travels through the bloodstream and can block a blood vessel.",
      "stroke": "Brain injury caused by interruption of blood supply, either from blocked vessel (ischemic) or bleeding (hemorrhagic).",
      "coronary artery disease": "Narrowing or blockage of coronary arteries, usually due to atherosclerosis, reducing blood flow to heart muscle.",
      "stenosis": "Abnormal narrowing of a blood vessel or other tubular organ or structure.",
      "ejection fraction": "Percentage of blood pumped out of the left ventricle with each contraction - normal is 50-70%.",
      "diuretic": "Medication that increases urine production, used to reduce fluid overload and blood pressure.",
    };

    // Check for each medical term in the card text
    Object.entries(medicalTerms).forEach(([term, definition]) => {
      if (lowerText.includes(term)) {
        concepts.push({ term: term.charAt(0).toUpperCase() + term.slice(1), definition });
      }
    });

    return concepts;
  };

  const keyConcepts = extractKeyConcepts(cardText);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-600" />
          Card Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {keyConcepts.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Badge variant="outline" className="bg-purple-50">Key Concepts</Badge>
            </h4>
            <div className="space-y-3">
              {keyConcepts.map((concept, index) => (
                <div key={index} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="font-semibold text-sm text-purple-900 mb-1">
                    {concept.term}
                  </div>
                  <p className="text-sm text-gray-700">{concept.definition}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {disease && (
          <div className="mt-4">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <Badge variant="outline" className="bg-red-50">Disease Overview: {disease.name}</Badge>
            </h4>
            
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="font-semibold text-sm text-red-900 mb-2">Clinical Symptoms</div>
                <ul className="list-disc list-inside space-y-1">
                  {disease.symptoms.map((symptom, index) => (
                    <li key={index} className="text-sm text-gray-700">{symptom}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="font-semibold text-sm text-blue-900 mb-1">Pathophysiology</div>
                <p className="text-sm text-gray-700">{disease.pathophysiology}</p>
              </div>

              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="font-semibold text-sm text-green-900 mb-1">Diagnosis</div>
                <p className="text-sm text-gray-700">{disease.diagnosis}</p>
              </div>

              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="font-semibold text-sm text-yellow-900 mb-1">Treatment</div>
                <p className="text-sm text-gray-700">{disease.treatment}</p>
              </div>
            </div>
          </div>
        )}

        {keyConcepts.length === 0 && !disease && (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No key concepts or disease information detected in this card.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
