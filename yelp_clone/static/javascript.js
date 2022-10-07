
const geocodingapi = 'AIzaSyDslMovopJy3Ce_xno22aJT8nZgyGUQTXY'
//const backendurl = 'http://127.0.0.1:8080'
const backendurl = 'https://yelpcloneviggy.wl.r.appspot.com/'
var data
var boolsubmit = false


window.onload= function(){
    document.getElementById('myform').addEventListener('submit', async event => {
    event.preventDefault();
    if(!boolsubmit)
    {
    var jsondata = await querylocapi();
    if (jsondata.businesses.length == 0) emptyrecord();
    else buildtable(jsondata);
    boolsubmit = !boolsubmit;
    }
    });
}


function emptyrecord(){
  var results = document.getElementById('results');
  var pnode = document.createElement('p');
  pnode.id = 'noresp';
  results.insertBefore(pnode,document.getElementById('myrestable'));
  document.getElementById('noresp').innerHTML= '<p> No records have been found </p>';
  document.getElementById('myrestable').style.display='hidden';
}

function buildtable(jsondata){
    var restable = document.getElementById('tablebody');
    for (i=0;i<jsondata.businesses.length;i++)
    {
        j=i+1;
        const row = document.createElement('tr');
        var distmiles = (jsondata.businesses[i].distance*0.000621371192).toFixed(2);
        row.innerHTML = `
        <td class = 'busnum'>
        ${j}
        </td>
        <td>
            <img src=${jsondata.businesses[i].image_url} class ='rowimages'>
        </td>
        <td class = 'busname' id= ${jsondata.businesses[i].id} onclick=businesscard(this)>
        ${jsondata.businesses[i].name}
        </td>
        <td class = 'busrating'>
        ${jsondata.businesses[i].rating}
        </td>
        <td class = 'busdistance'>
        ${distmiles}
        </td>`
        tablebody.append(row);
    }
    document.getElementById('myrestable').style.display='block';
}


async function businesscard(ele){
//  console.log(ele.getAttribute('id'));
  var url = `${backendurl}/businfo?id=${ele.getAttribute('id')}`;
  var res = await fetch(url,{method:'GET'});
  var resjson = await res.json();
  buildcard(resjson);
}

function buildcard(datajson){
  if(datajson.hours[0].is_open_now)
    document.getElementById('buscardstatus').innerHTML = `<div id='opensign'>Open Now</div>`;
  else 
  document.getElementById('buscardstatus').innerHTML = `<div id='closesign'>Closed</div>`;
  document.getElementById('cardbusname').innerHTML = datajson.name;
  document.getElementById('buscardcat').innerHTML = datajson.categories[0].alias;
  document.getElementById('catdisplay').style.display = 'block';
  document.getElementById('buscardaddress').innerHTML = datajson.location.display_address;
  document.getElementById('addressdisplay').style.display = 'block';
  document.getElementById('buscardphnumber').innerHTML = datajson.display_phone;
  document.getElementById('phonenumberdisplay').style.display = 'block';
  document.getElementById('buscardtrans').innerHTML = datajson.transactions;
  document.getElementById('transdisplay').style.display = 'block';
  document.getElementById('buscardprice').innerHTML = datajson.price;
  document.getElementById('pricedisplay').style.display = 'block';
  document.getElementById('buscardmoreinfo').innerHTML = `<a href = ${datajson.url}>Yelp</a>`;
  document.getElementById('moreinfodisplay').style.display = 'block'
  document.getElementById('photo1').innerHTML = `<img src=${datajson.photos[0]} style='height: 100%; width: 100%; object-fit: contain; object-position:top'>`;
  document.getElementById('photo2').innerHTML = `<img src=${datajson.photos[1]} style='height: 100%; width: 100%; object-fit: contain; object-position:top'>`;
  document.getElementById('photo3').innerHTML = `<img src=${datajson.photos[2]} style='height: 100%; width: 100%; object-fit: contain; object-position:top'>`;
  document.getElementById('businessinfocard').style.display = 'block';
  document.getElementById('shadow2').style.display = 'block';
  removemptyfields(datajson);
}


function removemptyfields(datajson){
  if(typeof datajson.categories[0].alias === 'undefined'|| datajson.categories[0].alias =='') document.getElementById('catdisplay').style.display = 'none';
  if(typeof datajson.location.display_address === 'undefined'|| datajson.location.display_address=='') document.getElementById('addressdisplay').style.display = 'none';
  if(typeof datajson.display_phone === 'undefined' || datajson.display_phone=='') document.getElementById('phonenumberdisplay').style.display = 'none';
  if(typeof datajson.transactions === 'undefined'||datajson.transactions=='') document.getElementById('transdisplay').style.display = 'none';
  if(typeof datajson.price === 'undefined'|| datajson.price=='') document.getElementById('pricedisplay').style.display = 'none';
  if(typeof datajson.url === 'undefined'||datajson.url=='') document.getElementById('moreinfodisplay').style.display = 'none';
}


function resetfields(){
    document.getElementById('myform').reset();
    var element =  document.getElementById('noresp');
    if (element != null)
    {
      element.remove();
    }
    document.getElementById("myrestable").style.display = "none";
    document.getElementById('tablebody').innerHTML='';
    document.getElementById('Location').disabled = false;
    document.getElementById('businessinfocard').style.display = 'none';
    document.getElementById('shadow2').style.display = 'none';
    boolsubmit = false;

}


function resettextloc(){

    var box = document.getElementById('autoloc')
    if(box.checked){
        document.getElementById('Location').value='';
        document.getElementById('Location').disabled = true;
    }
    else{
        document.getElementById('Location').disabled = false;
    }

}


async function querygoogleapi()
{   
    var form  = document.getElementById('myform');
    var formData = new FormData(form);
    var address = formData.get('Location');
    const akey = encodeURIComponent(address);
    var urlapi = `https://maps.googleapis.com/maps/api/geocode/json?address=${akey}&key=${geocodingapi}`;
    var res = await fetch(urlapi,{method:'get'})
    var obj = await res.json()
    var lat = obj.results[0].geometry.location.lat;
    var long = obj.results[0].geometry.location.lng;
    document.getElementById("lat").value = lat;
    document.getElementById("lng").value = long;
    document.getElementById('distancemeters').value = document.getElementById('distance').value*1609.34;
    var yelp_data_url = `${backendurl}/testing?`;
    var formData = new FormData(form);
    for (const pair of formData.entries()) {
        yelp_data_url+=`${pair[0]}=${encodeURIComponent(pair[1])}&`
    }
    var yelp_rest = await fetch(yelp_data_url,{
        method:'GET',
    })
    var yelp_data_json = await yelp_rest.json();
    return yelp_data_json;
}


        

async function queryautoloc2(){
    var form  = document.getElementById('myform');
    formData = new FormData(form);
    var url = 'https://ipinfo.io/?token=340e355e87a33d'
    var res = await fetch(url,{method:'get'})
    var obj = await res.json();
    var lat = obj.loc.split(',')[0];
    var long = obj.loc.split(',')[1];
    document.getElementById("lat").value = lat;
    document.getElementById("lng").value = long;
    document.getElementById('distancemeters').value = document.getElementById('distance').value*1609.34;
    var yelp_data_url = `${backendurl}/testing?`;
    var formData = new FormData(form);
    for (const pair of formData.entries()) {
        yelp_data_url+=`${pair[0]}=${encodeURIComponent(pair[1])}&`
    }
    var yelp_rest = await fetch(yelp_data_url,{
        method:'GET',
    })
    var yelp_data_json = await yelp_rest.json();
    return yelp_data_json;
}





async function querylocapi(){
    var check = document.getElementById('autoloc');
    if (check.checked)
    {
        var resdata = queryautoloc2();
    }
    else
    {
        var resdata=querygoogleapi();
    }
    return resdata;
}

// following code was taken from w3 schools.com on how to sort a table
//https://www.w3schools.com/howto/howto_js_sort_table.asp
function sortheading(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("myrestable");
    switching = true;
    dir = "asc";
    while (switching) {
      switching = false;
      rows = table.rows;
      for (i = 1; i < (rows.length - 1); i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("td")[n];
        y = rows[i + 1].getElementsByTagName("td")[n];
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchcount ++;
      } else {
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
    rows = table.rows;
    for (i=1;i<rows.length-1;i++){
      rows[i].getElementsByTagName('td')[0].innerHTML = i;
    }
  }