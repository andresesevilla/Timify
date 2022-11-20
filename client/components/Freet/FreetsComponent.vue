<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <CreateFreetForm />
      <header>
        <GetFreetsForm />
      </header>
      <section v-if="$store.state.freets.length">
        <FreetComponent v-for="freet in $store.state.freets" :key="freet.id" :freet="freet" />
      </section>
      <article v-else>
        <h3>No freets found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';

export default {
  name: 'FreetPage',
  components: { FreetComponent, GetFreetsForm, CreateFreetForm },
};
</script>