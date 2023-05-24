<h1>The Fridge</h1>
<a href="https://thefridgesystem.netlify.app/" target="_blank">Live Site Here</a>
<h2>Recipe book, shopping list, and home inventory system — all in one.<h2>
  
<p>A web-app for creating/tracking recipes, and using those to shop. The app tracks what you have, and lets you create shopping lists for what you need.</p>

<h2>Vision</h2>
<p>Are you tired of calling your roomate/spouse to see if you have onions at home? Now you don't have to, because you already know. This app makes shopping lists smart, letting you shop based on what you want to cook, and comparing what you already have to what you need.</p> 
<h3>User Flow<h3> 
 <ol>
   <li>Select or create a recipe using the Recipes tab.</li>
   <li>Select "Shop" to add any missing items to your shopping cart tab.</li>
   <li>Go shopping with the Cart tab, check off or adjust items as you go.</li>
   <li>Once you click "checkout" on the shopping tab, your items will be added to your home tab.</li>
   <li>Go back to the recipes tab and click "Cook". The proper ingredients will be consumed.</li>
</ol>
<h3>Outcome</h3>
<p>If you don't like flipping back and forth between the recipe you want to cook at the grocery store this app will be useful. If you sometimes forget what you do or don't have at home, this app will be useful. If shopping is pretty easy for you and you don't see the point of using something like this, that's fine too.</p>
<h2>Stack</h2>
<ul>
  <li>Frontend: React via Vite using TypeScript. Bootstrap and React Bootstrap for styling. I did the design in Figma.</li>
  <li>Backend: Express backend API accessing a MySQL database.</li>
  <li>Hosting: frontend is on Netlify, backend is on AWS EC2.</li>
  <li>Auth: React Context API and JSON Web Tokens (JWT) for validation.</li>
</ul>

<h3>Planned Updates</h3>
<ol>
  <li>Add weight units and "self" units (i.e. 1 muffin)</li>
  <li>Implement a password reset system and account modification system</li>
  <li>Make an earmarking system to make sure multiple recipes aren't claiming the same ingredient</li>
</ol>
   
<h3>Maybe Someday</h3>  
<ol>
  <li>Add a recipe sourcing solution: link with a third party API for recipes, create integration with popular recipes sites, make a parser (AI-based probably) to read in online recipes, add a recipe-book scanning feature.</li>
  <li>AI-based photo-scanning system to perform initial/periodic inventorying - take a picture and the AI updates your home inventory list.</li>
</ol>

