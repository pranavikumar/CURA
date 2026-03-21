import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Stethoscope, Eye, Hand } from "lucide-react";
import { AnatomyViewer } from "./AnatomyViewer";
import { ANATOMY_MODELS } from "../data/mockData";

export function ClinicalViewer() {
  const clinicalFindings = [
    {
      structure: "Heart",
      inspection: "Observe for chest wall abnormalities, visible pulsations, or scars from previous cardiac surgery",
      palpation: "Palpate PMI at 5th intercostal space, midclavicular line. Assess for thrills, heaves, or abnormal cardiac impulses",
      auscultation: "Listen at aortic (2nd R ICS), pulmonic (2nd L ICS), tricuspid (4th L ICS), and mitral (5th L ICS, MCL) areas",
      pearls: [
        "Laterally displaced PMI suggests LV enlargement (>1cm lateral to MCL)",
        "Parasternal heave indicates RV hypertrophy",
        "S3 gallop = ventricular dysfunction (Kentucky), S4 = stiff ventricle (Tennessee)",
        "Wide splitting of S2 that doesn't vary with respiration = ASD"
      ]
    },
    {
      structure: "Lungs",
      inspection: "Assess respiratory rate, use of accessory muscles, chest symmetry, barrel chest (COPD), tracheal deviation",
      palpation: "Tactile fremitus (increased in consolidation, decreased in effusion/PTX). Chest expansion should be symmetric",
      auscultation: "Note breath sounds quality. Crackles = fluid (HF, pneumonia), wheezes = airway obstruction, decreased = effusion/PTX",
      pearls: [
        "E-to-A changes (egophony) = consolidation",
        "Dullness to percussion + absent breath sounds = pleural effusion",
        "Hyperresonance + decreased breath sounds = pneumothorax",
        "Late inspiratory crackles that don't clear with coughing = pulmonary fibrosis"
      ]
    },
    {
      structure: "Kidneys",
      inspection: "Observe for flank asymmetry, visible masses, or surgical scars. Note skin changes (uremic frost is rare)",
      palpation: "Bimanual palpation: one hand on flank, other on abdomen. Normal kidneys usually not palpable except in thin patients",
      auscultation: "Listen for renal artery bruits (suggests renovascular HTN). Auscultate over epigastrium and flanks",
      pearls: [
        "Palpable kidney = enlarged (PKD, hydronephrosis, tumor)",
        "CVA tenderness = pyelonephritis or renal calculi",
        "Renal bruit + resistant HTN in young patient = fibromuscular dysplasia",
        "Bilateral flank masses + HTN + family history = ADPKD"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-blue-600" />
            <CardTitle>Clinical Examination Guide</CardTitle>
          </div>
          <p className="text-sm text-gray-600">
            Interactive anatomy explorer for clinical rotations. Master the physical exam with anatomical context.
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="heart" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="heart">Heart</TabsTrigger>
          <TabsTrigger value="lungs">Lungs</TabsTrigger>
          <TabsTrigger value="kidneys">Kidneys</TabsTrigger>
        </TabsList>

        <TabsContent value="heart" className="space-y-4">
          <AnatomyViewer model={ANATOMY_MODELS.heart} />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Clinical Examination: Cardiovascular</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderExamSection(clinicalFindings[0])}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lungs" className="space-y-4">
          <AnatomyViewer model={ANATOMY_MODELS.lung} />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Clinical Examination: Respiratory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderExamSection(clinicalFindings[1])}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kidneys" className="space-y-4">
          <AnatomyViewer model={ANATOMY_MODELS.kidney} />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Clinical Examination: Renal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderExamSection(clinicalFindings[2])}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function renderExamSection(finding: {
  structure: string;
  inspection: string;
  palpation: string;
  auscultation: string;
  pearls: string[];
}) {
  return (
    <>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Eye className="w-4 h-4 text-blue-600" />
          <h4 className="font-semibold text-sm">Inspection</h4>
        </div>
        <p className="text-sm text-gray-700 ml-6">{finding.inspection}</p>
      </div>

      <Separator />

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Hand className="w-4 h-4 text-green-600" />
          <h4 className="font-semibold text-sm">Palpation</h4>
        </div>
        <p className="text-sm text-gray-700 ml-6">{finding.palpation}</p>
      </div>

      <Separator />

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Stethoscope className="w-4 h-4 text-purple-600" />
          <h4 className="font-semibold text-sm">Auscultation</h4>
        </div>
        <p className="text-sm text-gray-700 ml-6">{finding.auscultation}</p>
      </div>

      <Separator />

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
        <h4 className="font-semibold text-sm mb-3 flex items-center gap-1">
          💎 High-Yield Clinical Pearls
        </h4>
        <ul className="space-y-2">
          {finding.pearls.map((pearl, idx) => (
            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5 flex-shrink-0 text-xs">
                {idx + 1}
              </Badge>
              <span>{pearl}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
