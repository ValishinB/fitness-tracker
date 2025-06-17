Parse.Cloud.define("signup", async (request) => {
  const { email, password } = request.params;
  const user = new Parse.User();
  user.set("username", email);
  user.set("email", email);
  user.set("password", password);
  await user.signUp();
  return user;
});
Parse.Cloud.define("addWorkout", async (request) => {
  const { type, duration, userId } = request.params;
  const Workout = Parse.Object.extend("Workout");
  const workout = new Workout();
  workout.set("type", type);
  workout.set("duration", duration);
  workout.set("user", { __type: "Pointer", className: "_User", objectId: userId });
  return workout.save();
});
Parse.Cloud.define("getWorkouts", async (req) => {
  const query = new Parse.Query("Workout");
  query.equalTo("user", req.params.userId);
  query.descending("createdAt");
  query.limit(10); 
  return query.find();
});