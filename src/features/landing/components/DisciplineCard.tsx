import { IntensityBar } from "../../../components/ui/IntensityBar";
import { Button } from "../../../components/ui/Button";

interface DisciplineCardProps {
  title: string;
  description: string;
  image: string;
  intensity: number;
}

export function DisciplineCard({ title, description, image, intensity }: DisciplineCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl h-[400px] w-full shadow-lg transition-transform duration-300 hover:-translate-y-2">
      {/* Background Image */}
      <img 
        src={image} 
        alt={title} 
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end h-full">
        <div className="translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
          <h3 className="text-3xl font-heading font-bold text-white uppercase mb-2">{title}</h3>
          <p className="text-gray-300 text-sm font-light mb-4 line-clamp-2 md:line-clamp-none">
            {description}
          </p>
          
          <div className="space-y-4">
            <IntensityBar percentage={intensity} />
            
            <Button variant="outline" size="sm" className="w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              VER DETALLES
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
