import React, { useState } from "react";
import jsQR from "jsqr";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import { TextField, Box, Typography, MenuItem, Select, InputLabel, FormControl } from "@mui/material";

GlobalWorkerOptions.workerSrc = pdfWorker;

// Opciones para Tipo de Comprobante
const tiposComprobante = [
  { value: "1", label: "1 - Factura A" },
  { value: "2", label: "2 - Nota de Débito A" },
  { value: "3", label: "3 - Nota de Crédito A" },
  { value: "4", label: "4 - Recibo A" },
  { value: "5", label: "5 - Nota de Venta al Contado A" },
  { value: "6", label: "6 - Factura B" },
  { value: "7", label: "7 - Nota de Débito B" },
  { value: "8", label: "8 - Nota de Crédito B" },
  { value: "9", label: "9 - Recibo B" },
  { value: "10", label: "10 - Nota de Venta al Contado B" },
  { value: "11", label: "11 - Factura C" },
  { value: "12", label: "12 - Nota de Débito C" },
  { value: "13", label: "13 - Nota de Crédito C" },
  { value: "15", label: "15 - Recibo C" },
  { value: "19", label: "19 - Factura de Exportación" },
  { value: "20", label: "20 - Nota Déb. P/Operac. con el Exterior" },
  { value: "21", label: "21 - Nota Créd. P/Operac. con el Exterior" },
  { value: "39", label: "39 - Otros Comprobantes A" },
  { value: "40", label: "40 - Otros Comprobantes B" },
  { value: "49", label: "49 - Comprobante de Compra de Bienes Usados" },
  { value: "51", label: "51 - Factura M" },
  { value: "52", label: "52 - Nota de Débito M" },
  { value: "53", label: "53 - Nota de Crédito M" },
  { value: "54", label: "54 - Recibo M" },
  { value: "60", label: "60 - Cta. de Vta. y Líquido Prod. A" },
  { value: "61", label: "61 - Cta. de Vta. y Líquido Prod. B" },
  { value: "63", label: "63 - Liquidación A" },
  { value: "64", label: "64 - Liquidación B" },
  { value: "109", label: "109 - Tique C" },
  { value: "114", label: "114 - Tique Nota de Crédito C" },
  { value: "195", label: "195 - Factura T" },
  { value: "196", label: "196 - Nota de Débito T" },
  { value: "197", label: "197 - Nota de Crédito T" },
  { value: "201", label: "201 - Factura de Crédito electrónica MiPyMEs (FCE) A" },
  { value: "202", label: "202 - Nota de Débito electrónica MiPyMEs (FCE) A" },
  { value: "203", label: "203 - Nota de Crédito electrónica MiPyMEs (FCE) A" },
  { value: "206", label: "206 - Factura de Crédito electrónica MiPyMEs (FCE) B" },
  { value: "207", label: "207 - Nota de Débito electrónica MiPyMEs (FCE) B" },
  { value: "208", label: "208 - Nota de Crédito electrónica MiPyMEs (FCE) B" },
  { value: "211", label: "211 - Factura de Crédito electrónica MiPyMEs (FCE) C" },
  { value: "212", label: "212 - Nota de Débito electrónica MiPyMEs (FCE) C" },
  { value: "213", label: "213 - Nota de Crédito electrónica MiPyMEs (FCE) C" },
];



// Opciones para Tipo de Documento
const tiposDocumento = [
  { value: "0", label: "00 - CI Policía Federal" },
  { value: "1", label: "01 - CI Buenos Aires" },
  { value: "2", label: "02 - CI Catamarca" },
  { value: "3", label: "03 - CI Córdoba" },
  { value: "4", label: "04 - CI Corrientes" },
  { value: "5", label: "05 - CI Entre Ríos" },
  { value: "6", label: "06 - CI Jujuy" },
  { value: "7", label: "07 - CI Mendoza" },
  { value: "8", label: "08 - CI La Rioja" },
  { value: "9", label: "09 - CI Salta" },
  { value: "10", label: "10 - CI San Juan" },
  { value: "11", label: "11 - CI San Luis" },
  { value: "12", label: "12 - CI Santa Fe" },
  { value: "13", label: "13 - CI Santiago del Estero" },
  { value: "14", label: "14 - CI Tucumán" },
  { value: "16", label: "16 - CI Chaco" },
  { value: "17", label: "17 - CI Chubut" },
  { value: "18", label: "18 - CI Formosa" },
  { value: "19", label: "19 - CI Misiones" },
  { value: "20", label: "20 - CI Neuquén" },
  { value: "21", label: "21 - CI La Pampa" },
  { value: "22", label: "22 - CI Río Negro" },
  { value: "23", label: "23 - CI Santa Cruz" },
  { value: "24", label: "24 - CI Tierra del Fuego" },
  { value: "80", label: "80 - CUIT" },
  { value: "86", label: "86 - CUIL" },
  { value: "87", label: "87 - CDI" },
  { value: "89", label: "89 - LE" },
  { value: "90", label: "90 - LC" },
  { value: "91", label: "91 - CI Extranjera" },
  { value: "92", label: "92 - en trámite" },
  { value: "93", label: "93 - Acta Nacimiento" },
  { value: "94", label: "94 - Pasaporte" },
  { value: "95", label: "95 - CI Bs. As. RNP" },
  { value: "96", label: "96 - DNI" },
  { value: "99", label: "99 - Doc. (otro)" }
];


const PdfQrReader = () => {
  const [qrUrl, setQrUrl] = useState(null);
  const [formData, setFormData] = useState({});

  const fetchCuitValue = async (url) => {
    try {
      const response = await fetch(`http://localhost:3001/proxy?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      console.log("Datos recibidos:", data);
      setFormData(data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setFormData({ error: "Error al obtener los datos." });
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = async () => {
        const pdf = await getDocument(new Uint8Array(fileReader.result)).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 3 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          await page.render(renderContext).promise;

          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "attemptBoth"
          });

          if (qrCode) {
            setQrUrl(qrCode.data);
            fetchCuitValue(qrCode.data);
            return;
          }
        }
        setQrUrl("No se encontró un código QR en el PDF.");
      };
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, margin: "auto" }}>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />

      {qrUrl && (
        <Typography sx={{ mt: 2 }}>
          QR Detectado: <a href={qrUrl} target="_blank" rel="noopener noreferrer">{qrUrl}</a>
        </Typography>
      )}

      {Object.keys(formData).length > 0 && (
        <Box sx={{ mt: 3 }}>
          {Object.entries(formData).map(([key, value]) => {
            if (key === "tipo_cbte") {
              return (
                <FormControl fullWidth key={key} margin="normal">
                  <InputLabel id="tipo-comprobante-label">Tipo de Comprobante</InputLabel>
                  <Select
                    labelId="tipo-comprobante-label"
                    value={value || ""}
                    variant="outlined"
                    readOnly
                  >
                    {tiposComprobante.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            } else if (key === "tipo_doc") {
              return (
                <FormControl fullWidth key={key} margin="normal">
                  <InputLabel id="tipo-documento-label">Tipo de Documento</InputLabel>
                  <Select
                    labelId="tipo-documento-label"
                    value={value || ""}
                    variant="outlined"
                    readOnly
                  >
                    {tiposDocumento.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            } else {
              return (
                <TextField
                  key={key}
                  label={key.replace(/_/g, " ")}
                  value={value || ""}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                />
              );
            }
          })}
        </Box>
      )}
    </Box>
  );
};

export default PdfQrReader;
