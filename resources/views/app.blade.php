<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Synchronize the preference before the page is painted. --}}
        <script>
            (function() {
                const cookieAppearance = @json($appearance);
                let storedAppearance = null;
                try {
                    storedAppearance = localStorage.getItem('appearance');
                } catch (error) {
                    // The cookie remains usable when browser storage is unavailable.
                }
                const valid = ['light', 'dark', 'system'];
                const appearance = valid.includes(storedAppearance) ? storedAppearance
                    : valid.includes(cookieAppearance) ? cookieAppearance : 'system';
                try {
                    localStorage.setItem('appearance', appearance);
                } catch (error) {}
                document.cookie = `appearance=${appearance};path=/;max-age=31536000;SameSite=Lax`;
                document.documentElement.dataset.appearance = appearance;
                const dark = appearance === 'dark' || (appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                document.documentElement.classList.toggle('dark', dark);
                document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: #eaf2f5;
            }

            html.dark {
                background-color: #0c1924;
            }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
