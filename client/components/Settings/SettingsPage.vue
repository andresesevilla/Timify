<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>Anxiety Shield</h2>
        <p class="info">Displays a warning message over freets that contain your anxiety inducing topics. Any user can
          report anxiety inducing topics in a freet by clicking "Report Anxiety."</p>
      </header>
      <AnxietyShieldComponent />
    </section>
    <section>
      <header>
        <h2>Account</h2>
      </header>
      <ChangePasswordForm />
    </section>
  </main>
</template>

<script>
import ChangePasswordForm from '@/components/Settings/ChangePasswordForm.vue';
import AnxietyShieldComponent from '@/components/AnxietyShield/AnixetyShieldComponent.vue'

export default {
  name: 'SettingsPage',
  components: {
    ChangePasswordForm, AnxietyShieldComponent
  }
};
</script>
