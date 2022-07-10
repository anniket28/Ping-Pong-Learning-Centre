// 
function openNavbarLinks() {
    document.getElementById('navbarLinks').style.width='175px'
}

function closeNavbarLinks() {
    document.getElementById('navbarLinks').style.width='0px'
}

// 
document.addEventListener('scroll',()=>{
    if(window.scrollY>=180){
        document.getElementById('backToTop').classList.remove('hidden')
    }
    else{
        document.getElementById('backToTop').classList.add('hidden')
    }
})
function backToTop(){
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
}

// 
function openWhatsapp() {
    window.open("https://api.whatsapp.com/send?text=hi&phone=7249999934","_blank")
}
