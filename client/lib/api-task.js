const add = async (data, authData) => {
  try {
    let response = await fetch(`/api/notes/by/${authData.userId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + authData.jwtToken,
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (err) {
    // console.log(err);
  }
};

export { add };
