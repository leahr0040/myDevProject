<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a> 
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#built-with">Built With</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project
This project manages a registration for the purchase of credits card


<!-- GETTING STARTED -->
## Getting Started

To use this progect ,download the project and run it with [web server for chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb/related) plugin



<!-- USAGE EXAMPLES -->
## Usage
<p>
The project uses local storage. All fields data is stored in local storage.
<div> The user can also add some parameters to the URL :</div>
<ul>

 <li>sponsership=&lt;sponsership code&gt; add a discount if vaild</li>  
  <li> seed=true for seeding the form with static parameters.</li> 
 The url parameters diagram:
<p>
    <img src="https://user-images.githubusercontent.com/71343931/126166871-70671877-9861-4741-8592-00e666e31e7c.png"  />
</p>

</ul>

The user fills in the form fields. It cannot continue until all fields are valid.</br>
To switch between the pages,he have to click on the Continue button. If he has clicked on it in the past and has not changed anything in the forms, he can also navigate the URL

On page 2 When the user enters an invalid email domain but is close to a valid domain, he receives an offer to change to a valid domain

On page 3 the user views his order summary, he can delete a card (but not the first one) or delete the first deposit of the cards by clicking on the trash can icon.</br>
In addition he can enter a coupon to get a discount on each card / order. He can change the coupon by entering another coupon code. If the coupon is not valid nothing has changed.
</p>




## Built With

This project was uses some framworks and plugins:
* [Bootstrap](https://getbootstrap.com)
* [JQuery](https://jquery.com)
* [Bootstrap-select](https://developer.snapappointments.com/bootstrap-select/)
* [JQuery.countdown](https://hilios.github.io/jQuery.countdown/)
* [Inputmask](https://github.com/RobinHerbots/Inputmask)




