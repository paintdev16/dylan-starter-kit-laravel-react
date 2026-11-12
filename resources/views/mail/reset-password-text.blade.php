{{ $appName }}

Restablece tu contraseña

Hola, {{ $name }}:

Recibimos una solicitud para restablecer la contraseña de tu cuenta. Abre el siguiente enlace para elegir una nueva:

{!! $resetUrl !!}

Este enlace vence en {{ $expires }} minutos. Si no solicitaste este cambio, puedes ignorar este mensaje.

{{ $appName }} · Mensaje automático
