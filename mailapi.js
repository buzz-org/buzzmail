async function signupoptions(data, db) {
    
    const query = `SELECT s.SignUpId, s.SignUpPro, s.ClassCSS FROM signupoptions s;`;
    const params = [];

    const response = await db.execQuery(query, params);

    const finalmsg =  { status: "success", code: 1, message: 'signupoptions successfull', signupoptions: response.result || [] };

    return finalmsg;
}

export default {
  signupoptions
};