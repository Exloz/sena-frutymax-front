import { Button } from "@/components/ui/button"

export default function Banner() {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-green-500 to-lime-500 text-white p-6 md:p-8 my-6">
      <div className="relative z-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Frutas y verduras frescas</h1>
        <p className="text-sm md:text-base mb-4 max-w-2xl">
          En FrutyMax estamos comprometidos con la sostenibilidad y mantenemos nuestras frutas y verduras frescas por
          más tiempo evitando desperdicios, así tus productos llegarán siempre frescos a casa.
        </p>
        <div className="mt-4">
          <div className="text-xl md:text-2xl font-bold mb-2">
            El 85% de las frutas y verduras que encuentras en FrutyMax son{" "}
            <span className="text-amber-300">locales</span>.
          </div>
          <p className="text-sm md:text-base mb-4">Comprándolas apoyas a miles de familias agricultoras.</p>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white">¡Conoce más!</Button>
        </div>
      </div>
      <div className="absolute right-0 bottom-0 opacity-20">{/* Decorative fruit images would go here */}</div>
    </div>
  )
}

