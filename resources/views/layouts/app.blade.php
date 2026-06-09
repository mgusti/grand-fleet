<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Grand Fleet - Command your fleet, conquer the seas. A naval strategy game of epic proportions.">

    <title>@yield('title', 'Grand Fleet - Command Your Fleet')</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:300,400,500,600,700,800,900&display=swap" rel="stylesheet" />

    <!-- Styles -->
    <link rel="stylesheet" href="{{ asset('css/landing.css') }}">
    @stack('styles')
</head>
<body>
    @include('partials.header')

    <main>
        @yield('content')
    </main>

    @include('partials.footer')

    <!-- Scripts -->
    <script src="{{ asset('js/landing.js') }}"></script>
    @stack('scripts')
</body>
</html>
