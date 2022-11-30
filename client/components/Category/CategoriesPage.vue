<template>
  <main>
    <p>TODO: maybe make this page more meaningful? adding stats, or clicking on it expands data for that category</p>
    <ManageCategoriesComponent />
  </main>
</template>

<script>
import ManageCategoriesComponent from "./ManageCategoriesComponent";

export default {
  name: "CategoriesPage",
  components: { ManageCategoriesComponent },
};
</script>