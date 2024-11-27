export default async function handler(req, res) {
    if (req.method === "POST") {
        const { texto, nombre_archivo } = req.body;

        if (!texto || !nombre_archivo) {
            return res.status(400).json({ error: "Faltan parámetros: texto o nombre_archivo" });
        }

        try {
            // Aquí puedes almacenar los datos en un Blob Store de Vercel o algún otro servicio
            console.log(`Guardando en Blob Storage: ${nombre_archivo}`);
            console.log(`Contenido: ${texto}`);

            // Simulación de éxito
            res.status(200).json({ message: "Archivo subido correctamente" });
        } catch (error) {
            console.error("Error al subir el archivo:", error);
            res.status(500).json({ error: "Error al subir el archivo" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).json({ error: `Método ${req.method} no permitido` });
    }
}
