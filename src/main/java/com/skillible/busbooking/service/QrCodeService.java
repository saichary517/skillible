package com.skillible.busbooking.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import org.springframework.stereotype.Service;

@Service
public class QrCodeService {
  public String generateBase64Png(String payload) {
    try {
      BitMatrix matrix = new MultiFormatWriter()
          .encode(new String(payload.getBytes(StandardCharsets.UTF_8), StandardCharsets.UTF_8),
              BarcodeFormat.QR_CODE, 320, 320);
      ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
      MatrixToImageWriter.writeToStream(matrix, "PNG", outputStream);
      return Base64.getEncoder().encodeToString(outputStream.toByteArray());
    } catch (Exception ex) {
      throw new IllegalStateException("Unable to generate QR code", ex);
    }
  }
}
