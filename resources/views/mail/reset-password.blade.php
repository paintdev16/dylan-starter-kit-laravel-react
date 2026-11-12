<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Restablece tu contraseña</title>
</head>
<body style="margin:0;padding:0;background-color:#eaf2f5;font-family:Arial,Helvetica,sans-serif;color:#203d50;">
    <table role="presentation" style="width:100%;border-collapse:collapse;background-color:#eaf2f5;">
        <tr><td align="center" style="padding:40px 16px;">
            <table role="presentation" style="width:100%;max-width:560px;border-collapse:separate;border-spacing:0;">
                <tr><td style="padding:0 4px 20px;font-size:18px;font-weight:bold;color:#386b87;">{{ $appName }}</td></tr>
                <tr><td style="background-color:#ffffff;border:1px solid #dbe6eb;border-radius:16px;padding:36px 32px;">
                    <table role="presentation" style="border-collapse:collapse;"><tr><td style="background-color:#eaf2f7;border:1px solid #b8d2e1;border-radius:10px;padding:9px 12px;color:#386b87;font-size:12px;font-weight:bold;letter-spacing:0.06em;">SEGURIDAD DE TU CUENTA</td></tr></table>
                    <h1 style="margin:24px 0 12px;font-size:26px;line-height:1.25;color:#203d50;">Restablece tu contraseña</h1>
                    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#315e79;">Hola, {{ $name }}:</p>
                    <p style="margin:0 0 26px;font-size:16px;line-height:1.6;color:#59788a;">Recibimos una solicitud para restablecer la contraseña de tu cuenta. Usa el siguiente botón para elegir una nueva.</p>
                    <table role="presentation" style="border-collapse:separate;border-spacing:0;"><tr><td align="center" style="border-radius:10px;background-color:#386b87;"><a href="{{ $resetUrl }}" style="display:inline-block;padding:14px 24px;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;">Restablecer contraseña</a></td></tr></table>
                    <p style="margin:26px 0 0;font-size:14px;line-height:1.6;color:#59788a;">Este enlace vence en {{ $expires }} minutos. Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
                    <table role="presentation" style="width:100%;border-collapse:collapse;margin-top:28px;"><tr><td style="border-top:1px solid #dbe6eb;padding-top:20px;font-size:12px;line-height:1.6;color:#59788a;">Si el botón no funciona, copia y pega este enlace en tu navegador:<br><a href="{{ $resetUrl }}" style="color:#386b87;word-break:break-all;">{{ $resetUrl }}</a></td></tr></table>
                </td></tr>
                <tr><td align="center" style="padding:24px 12px 0;font-size:12px;color:#78909e;">{{ $appName }} · Mensaje automático</td></tr>
            </table>
        </td></tr>
    </table>
</body>
</html>
