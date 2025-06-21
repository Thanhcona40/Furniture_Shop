export async function checkAuthenticated(){
    var ok = false;

    const userData = localStorage.getItem('user');
    return userData !== null;
}