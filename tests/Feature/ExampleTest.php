<?php

use Inertia\Testing\AssertableInertia as Assert;

test('returns a successful response', function () {
    $response = $this->get(route('home'));

    $response->assertOk();
});

test('renders inertia error page when navigating to a non-existent url', function () {
    $response = $this->get('/non-existent-route');

    $response
        ->assertNotFound()
        ->assertInertia(fn (Assert $page) => $page
            ->component('error-page')
            ->where('status', 404),
        );
});
