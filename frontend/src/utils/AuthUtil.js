export async function checkAuthenticated(){
    var ok = false;

    const userData = localStorage.getItem('userData');
    return userData !== null;
}