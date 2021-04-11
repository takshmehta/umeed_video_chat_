export const saveEmails = (userId, token, emails) => {
  // console.log("from here");
  // console.log(emails);
  return fetch(
    `https://infinite-journey-52315.herokuapp.com/api/email/${userId}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(emails),
    }
  )
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const viewEmails = (userId) => {
  return fetch(
    `https://infinite-journey-52315.herokuapp.com/api/emails/${userId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateEmails = (userId, token, emailId, emails) => {
  return fetch(
    `https://infinite-journey-52315.herokuapp.com/api/email/${userId}/${emailId}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(emails),
    }
  )
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const sendEmailLink = (emails, link) => {
  return fetch("https://infinite-journey-52315.herokuapp.com/api/access", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emails, link),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};
