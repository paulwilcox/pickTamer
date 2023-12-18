<template>
  <main>
    <h1>Pics Page</h1>

    <div v-for="(item, index) in imageList" :key="index" class="image-container">
      <img
        :src="getImageUrl(item)"
        :alt="'Image ' + (index + 1)"
        @click="selectImage(index)"
        :class="{ selected: selectedIndex === index }"
      >
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      imageList: null, 
      selectedIndex: null,
    };
  },
  methods: {
    fetchData() {
      console.log('fetchData()')
      fetch('http://localhost:3000/pics')
        .then(response => {
          if (!response.ok) 
            throw new Error(`HTTP error! Status: ${response.status}`);
          return response.json();
        })
        .then(json => {
          this.imageList = JSON.parse(json)
        })
        .catch(error => console.error(error));
    },
    getImageUrl(imageItem) {
      // Construct the image URL based on your server logic
      return `http://localhost:3000/image?fileName=${imageItem.picId}.${imageItem.extension}`;
    },
    selectImage(index) {
      // Toggle the selection when clicking on an image
      this.selectedIndex = this.selectedIndex === index ? null : index;
    },
    handleKeyPress(event) {
      if (event.ctrlKey) {
        if (event.key === 'ArrowUp' && this.selectedIndex !== null && this.selectedIndex > 0) {
          this.swapImages(this.selectedIndex, this.selectedIndex - 1);
        } else if (event.key === 'ArrowDown' && this.selectedIndex !== null && this.selectedIndex < this.imageList.length - 1) {
          this.swapImages(this.selectedIndex, this.selectedIndex + 1);
        }
      }
    },
    swapImages(indexA, indexB) {
      const imageA = this.imageList[indexA];
      const imageB = this.imageList[indexB];

      // Capture identifiers before the swap
      const prevImageIdA = indexA > 0 ? this.imageList[indexA - 1].id : null;
      const nextImageIdA = indexA < this.imageList.length - 1 ? this.imageList[indexA + 1].id : null;
      const prevImageIdB = indexB > 0 ? this.imageList[indexB - 1].id : null;
      const nextImageIdB = indexB < this.imageList.length - 1 ? this.imageList[indexB + 1].id : null;

      // Swap the positions of two images in the list
      this.imageList[indexA] = imageB;
      this.imageList[indexB] = imageA;

      // Capture identifiers after the swap
      const updatedPrevImageIdA = indexB > 0 ? this.imageList[indexB - 1].id : null;
      const updatedNextImageIdA = indexB < this.imageList.length - 1 ? this.imageList[indexB + 1].id : null;
      const updatedPrevImageIdB = indexA > 0 ? this.imageList[indexA - 1].id : null;
      const updatedNextImageIdB = indexA < this.imageList.length - 1 ? this.imageList[indexA + 1].id : null;

      // Now, you can send the captured information to the server for database update
      this.updateDatabase(
        imageA.id,
        imageB.id,
        prevImageIdA,
        nextImageIdA,
        prevImageIdB,
        nextImageIdB,
        updatedPrevImageIdA,
        updatedNextImageIdA,
        updatedPrevImageIdB,
        updatedNextImageIdB
      );

      // Update the selected index after the swap
      this.selectedIndex = indexB;
    },
    updateDatabase(
      idA,
      idB,
      prevIdA,
      nextIdA,
      prevIdB,
      nextIdB,
      updatedPrevIdA,
      updatedNextIdA,
      updatedPrevIdB,
      updatedNextIdB
    ) {
      // Send the captured information to the server to update the database
      // You can use an HTTP request (e.g., Axios) to send the data to your server
      console.log('Update database with the following information:');
      console.log('Image A:', idA, 'Previous:', prevIdA, 'Next:', nextIdA);
      console.log('Image B:', idB, 'Previous:', prevIdB, 'Next:', nextIdB);
      console.log('Updated Image A:', idA, 'Previous:', updatedPrevIdA, 'Next:', updatedNextIdA);
      console.log('Updated Image B:', idB, 'Previous:', updatedPrevIdB, 'Next:', updatedNextIdB);
    },
  },
  mounted() {
    // Listen for keydown events to handle Ctrl+Up/Down arrow key presses
    window.addEventListener('keydown', this.handleKeyPress);
    this.fetchData();
  },
  beforeDestroy() {
    // Remove the event listener to prevent memory leaks
    window.removeEventListener('keydown', this.handleKeyPress);
  },
};
</script>

<style>
.image-container {
  margin: 10px;
  cursor: pointer;
  display: inline-block;
}

.selected {
  border: 2px solid blue;
}
</style>
