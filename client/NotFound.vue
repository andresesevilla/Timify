<!-- Catch-all page for visiting invalid URLs that haven't been registered -->

<template>
  <main>
    <section>
      <h2>{{ $route.params.username ? 'User' : 'Page' }} Not Found</h2>
      <p v-if="$route.params.username">The user {{ $route.params.username }} does not
        exist.</p>
      <p v-else>The requested page does not exist.</p>
      <h3>
        <router-link to="/">
          Return to home page
        </router-link>
      </h3>
    </section>
  </main>
</template>