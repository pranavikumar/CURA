import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import type { AnatomyModel } from "../data/mockData";

// Simple 2D anatomy visualization using CSS
function AnatomyDiagram({ modelId, onStructureClick }: { modelId: string; onStructureClick: (name: string) => void }) {
  const [hoveredStructure, setHoveredStructure] = useState<string | null>(null);

  if (modelId === "heart") {
    return (
      <svg viewBox="0 0 400 400" className="w-full h-full">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Right Atrium */}
        <ellipse 
          cx="250" cy="120" rx="45" ry="40"
          fill={hoveredStructure === "Right Atrium" ? "#60a5fa" : "#3b82f6"}
          opacity="0.8"
          stroke="#1e40af" strokeWidth="2"
          className="cursor-pointer transition-all hover:opacity-100"
          filter={hoveredStructure === "Right Atrium" ? "url(#glow)" : ""}
          onMouseEnter={() => setHoveredStructure("Right Atrium")}
          onMouseLeave={() => setHoveredStructure(null)}
          onClick={() => onStructureClick("Right Atrium")}
        />
        <text x="250" y="125" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" pointerEvents="none">RA</text>
        
        {/* Right Ventricle */}
        <path 
          d="M 250 160 L 280 280 L 220 280 Z"
          fill={hoveredStructure === "Right Ventricle" ? "#93c5fd" : "#60a5fa"}
          opacity="0.8"
          stroke="#1e40af" strokeWidth="2"
          className="cursor-pointer transition-all hover:opacity-100"
          filter={hoveredStructure === "Right Ventricle" ? "url(#glow)" : ""}
          onMouseEnter={() => setHoveredStructure("Right Ventricle")}
          onMouseLeave={() => setHoveredStructure(null)}
          onClick={() => onStructureClick("Right Ventricle")}
        />
        <text x="250" y="230" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" pointerEvents="none">RV</text>
        
        {/* Left Atrium */}
        <ellipse 
          cx="150" cy="120" rx="45" ry="40"
          fill={hoveredStructure === "Left Atrium" ? "#f87171" : "#dc2626"}
          opacity="0.8"
          stroke="#991b1b" strokeWidth="2"
          className="cursor-pointer transition-all hover:opacity-100"
          filter={hoveredStructure === "Left Atrium" ? "url(#glow)" : ""}
          onMouseEnter={() => setHoveredStructure("Left Atrium")}
          onMouseLeave={() => setHoveredStructure(null)}
          onClick={() => onStructureClick("Left Atrium")}
        />
        <text x="150" y="125" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" pointerEvents="none">LA</text>
        
        {/* Left Ventricle */}
        <path 
          d="M 150 160 L 185 290 L 115 290 Z"
          fill={hoveredStructure === "Left Ventricle" ? "#fca5a5" : "#ef4444"}
          opacity="0.8"
          stroke="#991b1b" strokeWidth="2"
          className="cursor-pointer transition-all hover:opacity-100"
          filter={hoveredStructure === "Left Ventricle" ? "url(#glow)" : ""}
          onMouseEnter={() => setHoveredStructure("Left Ventricle")}
          onMouseLeave={() => setHoveredStructure(null)}
          onClick={() => onStructureClick("Left Ventricle")}
        />
        <text x="150" y="240" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" pointerEvents="none">LV</text>
        
        {/* Aortic Valve */}
        <circle 
          cx="150" cy="160" r="15"
          fill={hoveredStructure === "Aortic Valve" ? "#fbbf24" : "#f59e0b"}
          opacity="0.9"
          stroke="#92400e" strokeWidth="2"
          className="cursor-pointer transition-all hover:opacity-100"
          filter={hoveredStructure === "Aortic Valve" ? "url(#glow)" : ""}
          onMouseEnter={() => setHoveredStructure("Aortic Valve")}
          onMouseLeave={() => setHoveredStructure(null)}
          onClick={() => onStructureClick("Aortic Valve")}
        />
        <text x="150" y="165" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" pointerEvents="none">AV</text>
        
        {/* Mitral Valve */}
        <circle 
          cx="120" cy="160" r="12"
          fill={hoveredStructure === "Mitral Valve" ? "#fcd34d" : "#f59e0b"}
          opacity="0.9"
          stroke="#92400e" strokeWidth="2"
          className="cursor-pointer transition-all hover:opacity-100"
          filter={hoveredStructure === "Mitral Valve" ? "url(#glow)" : ""}
          onMouseEnter={() => setHoveredStructure("Mitral Valve")}
          onMouseLeave={() => setHoveredStructure(null)}
          onClick={() => onStructureClick("Mitral Valve")}
        />
        <text x="120" y="164" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" pointerEvents="none">MV</text>
        
        {hoveredStructure && (
          <text x="200" y="350" textAnchor="middle" fill="#1f2937" fontSize="16" fontWeight="bold">
            {hoveredStructure}
          </text>
        )}
      </svg>
    );
  }

  if (modelId === "lung") {
    return (
      <svg viewBox="0 0 400 400" className="w-full h-full">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Right Upper Lobe */}
        <ellipse 
          cx="270" cy="120" rx="50" ry="55"
          fill={hoveredStructure === "Right Upper Lobe" ? "#f9a8d4" : "#ec4899"}
          opacity="0.7"
          stroke="#9d174d" strokeWidth="2"
          className="cursor-pointer transition-all hover:opacity-100"
          filter={hoveredStructure === "Right Upper Lobe" ? "url(#glow)" : ""}
          onMouseEnter={() => setHoveredStructure("Right Upper Lobe")}
          onMouseLeave={() => setHoveredStructure(null)}
          onClick={() => onStructureClick("Right Upper Lobe")}
        />
        <text x="270" y="125" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" pointerEvents="none">RUL</text>
        
        {/* Right Middle Lobe */}
        <ellipse 
          cx="290" cy="200" rx="40" ry="35"
          fill={hoveredStructure === "Right Middle Lobe" ? "#f9a8d4" : "#db2777"}
          opacity="0.7"
          stroke="#9d174d" strokeWidth="2"
          className="cursor-pointer transition-all hover:opacity-100"
          filter={hoveredStructure === "Right Middle Lobe" ? "url(#glow)" : ""}
          onMouseEnter={() => setHoveredStructure("Right Middle Lobe")}
          onMouseLeave={() => setHoveredStructure(null)}
          onClick={() => onStructureClick("Right Middle Lobe")}
        />
        <text x="290" y="205" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" pointerEvents="none">RML</text>
        
        {/* Right Lower Lobe */}
        <ellipse 
          cx="270" cy="280" rx="55" ry="60"
          fill={hoveredStructure === "Lower Lobes" ? "#f9a8d4" : "#be185d"}
          opacity="0.7"
          stroke="#9d174d" strokeWidth="2"
          className="cursor-pointer transition-all hover:opacity-100"
          filter={hoveredStructure === "Lower Lobes" ? "url(#glow)" : ""}
          onMouseEnter={() => setHoveredStructure("Lower Lobes")}
          onMouseLeave={() => setHoveredStructure(null)}
          onClick={() => onStructureClick("Lower Lobes")}
        />
        <text x="270" y="285" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" pointerEvents="none">RLL</text>
        
        {/* Left Upper Lobe */}
        <ellipse 
          cx="130" cy="120" rx="50" ry="55"
          fill={hoveredStructure === "Left Upper Lobe" ? "#c084fc" : "#a855f7"}
          opacity="0.7"
          stroke="#6b21a8" strokeWidth="2"
          className="cursor-pointer transition-all hover:opacity-100"
          filter={hoveredStructure === "Left Upper Lobe" ? "url(#glow)" : ""}
          onMouseEnter={() => setHoveredStructure("Left Upper Lobe")}
          onMouseLeave={() => setHoveredStructure(null)}
          onClick={() => onStructureClick("Left Upper Lobe")}
        />
        <text x="130" y="125" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" pointerEvents="none">LUL</text>
        
        {/* Left Lower Lobe */}
        <ellipse 
          cx="130" cy="280" rx="55" ry="60"
          fill={hoveredStructure === "Lower Lobes" ? "#c084fc" : "#9333ea"}
          opacity="0.7"
          stroke="#6b21a8" strokeWidth="2"
          className="cursor-pointer transition-all hover:opacity-100"
          filter={hoveredStructure === "Lower Lobes" ? "url(#glow)" : ""}
          onMouseEnter={() => setHoveredStructure("Lower Lobes")}
          onMouseLeave={() => setHoveredStructure(null)}
          onClick={() => onStructureClick("Lower Lobes")}
        />
        <text x="130" y="285" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" pointerEvents="none">LLL</text>
        
        {hoveredStructure && (
          <text x="200" y="370" textAnchor="middle" fill="#1f2937" fontSize="16" fontWeight="bold">
            {hoveredStructure}
          </text>
        )}
      </svg>
    );
  }

  // Kidney/Nephron
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Glomerulus */}
      <circle 
        cx="200" cy="80" r="35"
        fill={hoveredStructure === "Glomerulus" ? "#fde047" : "#eab308"}
        opacity="0.8"
        stroke="#854d0e" strokeWidth="2"
        className="cursor-pointer transition-all hover:opacity-100"
        filter={hoveredStructure === "Glomerulus" ? "url(#glow)" : ""}
        onMouseEnter={() => setHoveredStructure("Glomerulus")}
        onMouseLeave={() => setHoveredStructure(null)}
        onClick={() => onStructureClick("Glomerulus")}
      />
      <text x="200" y="85" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" pointerEvents="none">Glomerulus</text>
      
      {/* Proximal Tubule */}
      <rect 
        x="175" y="120" width="50" height="70"
        rx="10"
        fill={hoveredStructure === "Proximal Tubule" ? "#86efac" : "#22c55e"}
        opacity="0.8"
        stroke="#166534" strokeWidth="2"
        className="cursor-pointer transition-all hover:opacity-100"
        filter={hoveredStructure === "Proximal Tubule" ? "url(#glow)" : ""}
        onMouseEnter={() => setHoveredStructure("Proximal Tubule")}
        onMouseLeave={() => setHoveredStructure(null)}
        onClick={() => onStructureClick("Proximal Tubule")}
      />
      <text x="200" y="160" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" pointerEvents="none">PCT</text>
      
      {/* Loop of Henle */}
      <path 
        d="M 200 190 Q 120 230 200 270"
        fill="none"
        stroke={hoveredStructure === "Loop of Henle" ? "#7dd3fc" : "#0ea5e9"}
        strokeWidth="30"
        opacity="0.8"
        className="cursor-pointer transition-all hover:opacity-100"
        filter={hoveredStructure === "Loop of Henle" ? "url(#glow)" : ""}
        onMouseEnter={() => setHoveredStructure("Loop of Henle")}
        onMouseLeave={() => setHoveredStructure(null)}
        onClick={() => onStructureClick("Loop of Henle")}
      />
      <text x="140" y="235" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" pointerEvents="none">Loop</text>
      
      {/* Distal Tubule */}
      <rect 
        x="175" y="270" width="50" height="50"
        rx="10"
        fill={hoveredStructure === "Distal Tubule" ? "#c4b5fd" : "#8b5cf6"}
        opacity="0.8"
        stroke="#5b21b6" strokeWidth="2"
        className="cursor-pointer transition-all hover:opacity-100"
        filter={hoveredStructure === "Distal Tubule" ? "url(#glow)" : ""}
        onMouseEnter={() => setHoveredStructure("Distal Tubule")}
        onMouseLeave={() => setHoveredStructure(null)}
        onClick={() => onStructureClick("Distal Tubule")}
      />
      <text x="200" y="300" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" pointerEvents="none">DCT</text>
      
      {/* Collecting Duct */}
      <rect 
        x="185" y="325" width="30" height="50"
        rx="8"
        fill={hoveredStructure === "Collecting Duct" ? "#fda4af" : "#f43f5e"}
        opacity="0.8"
        stroke="#9f1239" strokeWidth="2"
        className="cursor-pointer transition-all hover:opacity-100"
        filter={hoveredStructure === "Collecting Duct" ? "url(#glow)" : ""}
        onMouseEnter={() => setHoveredStructure("Collecting Duct")}
        onMouseLeave={() => setHoveredStructure(null)}
        onClick={() => onStructureClick("Collecting Duct")}
      />
      <text x="200" y="355" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" pointerEvents="none">CD</text>
      
      {hoveredStructure && (
        <text x="200" y="390" textAnchor="middle" fill="#1f2937" fontSize="14" fontWeight="bold">
          {hoveredStructure}
        </text>
      )}
    </svg>
  );
}

interface AnatomyViewerProps {
  model: AnatomyModel;
  showClinicalRelevance?: boolean;
}

export function AnatomyViewer({ model, showClinicalRelevance = true }: AnatomyViewerProps) {
  const [selectedStructure, setSelectedStructure] = useState<string | null>(null);

  const handleStructureClick = (structureName: string) => {
    setSelectedStructure(structureName);
  };

  const getModelComponent = () => {
    switch (model.id) {
      case "heart":
        return <AnatomyDiagram modelId="heart" onStructureClick={handleStructureClick} />;
      case "lung":
        return <AnatomyDiagram modelId="lung" onStructureClick={handleStructureClick} />;
      case "kidney":
        return <AnatomyDiagram modelId="kidney" onStructureClick={handleStructureClick} />;
      default:
        return <AnatomyDiagram modelId="heart" onStructureClick={handleStructureClick} />;
    }
  };

  const selectedStructureData = model.structures.find(s => s.name === selectedStructure);

  return (
    <div className={`grid grid-cols-1 ${showClinicalRelevance ? 'lg:grid-cols-2' : ''} gap-4`}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{model.name}</CardTitle>
          <p className="text-sm text-gray-600">{model.description}</p>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden p-4 flex items-center justify-center">
            {getModelComponent()}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
            <strong>💡 Tip:</strong> Hover over structures to highlight them. Click to view clinical details.
          </div>
        </CardContent>
      </Card>

      {showClinicalRelevance && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">Clinical Relevance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-700">{model.clinicalRelevance}</p>

            <Separator />

            {selectedStructureData ? (
              <div className="space-y-3">
                <div>
                  <Badge variant="default" className="mb-2">{selectedStructureData.name}</Badge>
                  <p className="text-sm text-gray-700">{selectedStructureData.description}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1 flex items-center gap-1">
                    🩺 Clinical Pearl
                  </h4>
                  <p className="text-sm text-gray-700">{selectedStructureData.clinicalPearl}</p>
                </div>
              </div>
            ) : (
              <div>
                <h4 className="font-semibold text-sm mb-3">Available Structures:</h4>
                <div className="space-y-2">
                  {model.structures.map((structure, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedStructure(structure.name)}
                    >
                      {structure.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}