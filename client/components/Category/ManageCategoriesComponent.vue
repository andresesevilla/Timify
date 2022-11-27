<template>
  <section v-if="!editing">
    <ul id="categories-list">
      <b-collapse
        v-for="category in categories" :key="category.id"
        class="card" animation="slide">
        <template #trigger="props">
          <div class="card-header" role="button">
              <p class="card-header-title">{{category.name}}</p>
              <!-- <b-input class="card-header-title" v-model="category.name" /> -->
              <a class="card-header-icon"><b-icon :icon="props.open ? 'menu-down' : 'menu-up'"></b-icon></a>
          </div>
        </template>
        <div class="card-content">
          <div class="content">
            <ul v-if="category.subcategories.length" id="subcategories-list">
              <li v-for="subcategory in category.subcategories" :key="subcategory.id" class="card subcategory">
                {{ subcategory.name }}
              </li>
            </ul>
          </div>
        </div>
        <footer class="card-footer">
          <a class="card-footer-item"><b-icon icon="plus" /> Add subcategory</a>
          <a class="card-footer-item"><b-icon icon="pen" /> Edit</a>
          <a class="card-footer-item"><b-icon icon="delete" />Delete category</a>
        </footer>
      </b-collapse>
    </ul>
  </section>
  <section v-else>
    <ul id="categories-list">
      <div
        v-for="category in categories" :key="category.id"
        class="card" animation="slide">
        <div class="card-header" role="button">
            <!-- <p class="card-header-title">{{category.name}}</p> -->
            <b-input class="card-header-title" v-model="category.name" />
            <!-- <a class="card-header-icon"><b-icon :icon="props.open ? 'menu-down' : 'menu-up'"></b-icon></a> -->
        </div>
        <div class="card-content">
          <div class="content">
            <ul v-if="category.subcategories.length" id="subcategories-list">
              <li v-for="subcategory in category.subcategories" :key="subcategory.id" class="card subcategory">
                <!-- {{ subcategory.name }} -->
                <b-input class="card-header-title" v-model="subcategory.name" />
                <a><b-icon icon="delete" /></a>
              </li>
            </ul>
          </div>
        </div>
        <footer class="card-footer">
          <a class="card-footer-item"><b-icon icon="plus" /> Add subcategory</a>
          <a class="card-footer-item"><b-icon icon="pen" /> Edit</a>
          <a class="card-footer-item"><b-icon icon="delete" />Delete category</a>
        </footer>
      </div>
    </ul>
  </section>
</template>

<script>
export default {
  name: "ManageCategoriesComponent",
  data() {
    return {
      editing: false,
      categories: null,
    }
  },
  created() {
    this.fetchCategories();
  },
  methods: {
    fetchCategories() {
      // fetch('/api/categories')
      //   .then(response => response.json())
      //   .then(categories => {
      //     this.categories = categories;
      //   });
      this.categories = [
        {name: 'Category 1', subcategories: [{name: 'Subcategory 1'}, {name: 'Subcategory 2'}]},
        {name: 'Category 2', subcategories: [{name: 'Subcategory 3'}, {name: 'Subcategory 4'}]},
        {name: 'Category 3', subcategories: [{name: 'Subcategory 5'}, {name: 'Subcategory 6'}]},
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/public/variables.scss';

section {
  max-width: 35em;
  margin: auto;
}
.card {
  margin-bottom: 1em;
}
li {
  list-style: none;
  margin-left: 0;
}
#categories-list, #subcategories-list {
  margin-left: 0;
}
.subcategory.card {
  padding: 0.5em 1em;
  display: flex;
  width: max-content;
  align-items: center; 
}
.card-content {
  padding: 1em;
  // display: flex;
  // justify-content: center;
}
</style>