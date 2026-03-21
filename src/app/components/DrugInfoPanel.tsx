import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { AlertCircle, Info, Pill } from "lucide-react";
import type { DrugInfo, DiseaseInfo } from "../data/mockData";

interface DrugInfoPanelProps {
  drug?: DrugInfo;
  disease?: DiseaseInfo;
}

export function DrugInfoPanel({ drug, disease }: DrugInfoPanelProps) {
  if (!drug && !disease) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center text-gray-500">
          <Info className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Select a flashcard to see relevant drug information and disease details</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {drug && (
        <Card className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-xl">{drug.name}</CardTitle>
            </div>
            <Badge variant="outline" className="w-fit mt-1">
              {drug.class}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Generic Name</h4>
              <p className="text-sm text-gray-700">{drug.genericName}</p>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold text-sm mb-2">Mechanism of Action</h4>
              <p className="text-sm text-gray-700">{drug.mechanism}</p>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold text-sm mb-2">Indications</h4>
              <ul className="space-y-1">
                {drug.indications.map((indication, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{indication}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-red-600" />
                Contraindications
              </h4>
              <ul className="space-y-1">
                {drug.contraindications.map((contra, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>{contra}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold text-sm mb-2">Adverse Effects</h4>
              <ul className="space-y-1">
                {drug.adverseEffects.map((effect, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>{effect}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold text-sm mb-2">Dosage</h4>
              <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded">{drug.dosage}</p>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold text-sm mb-2">Drug Interactions</h4>
              <ul className="space-y-1">
                {drug.interactions.map((interaction, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>{interaction}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {disease && (
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">{disease.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Clinical Presentation</h4>
              <ul className="space-y-1">
                {disease.symptoms.map((symptom, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold text-sm mb-2">Pathophysiology</h4>
              <p className="text-sm text-gray-700">{disease.pathophysiology}</p>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold text-sm mb-2">Diagnosis</h4>
              <p className="text-sm text-gray-700">{disease.diagnosis}</p>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold text-sm mb-2">Treatment</h4>
              <p className="text-sm text-gray-700 bg-green-50 p-2 rounded">{disease.treatment}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
