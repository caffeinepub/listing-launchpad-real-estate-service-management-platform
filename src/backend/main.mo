import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import List "mo:core/List";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    role : Text;
  };

  type Property = {
    id : Text;
    address : Text;
    city : Text;
    state : Text;
    zip : Text;
    owner : Principal;
    timestamp : Int;
  };

  type ServiceRequest = {
    id : Text;
    propertyId : Text;
    title : Text;
    description : Text;
    urgency : Text;
    status : Text;
    photos : [Text];
    createdBy : Principal;
    createdAt : Int;
    updatedAt : Int;
  };

  type ContactForm = {
    id : Text;
    name : Text;
    email : Text;
    phone : Text;
    message : Text;
    submittedAt : Int;
  };

  public type Plan = {
    id : Text;
    name : Text;
    monthlyPrice : Nat;
    description : Text;
    features : [Text];
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let properties = Map.empty<Text, Property>();
  let serviceRequests = Map.empty<Text, ServiceRequest>();
  let contactForms = Map.empty<Text, ContactForm>();
  let plans = Map.empty<Text, Plan>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Property Management
  public shared ({ caller }) func addProperty(id : Text, address : Text, city : Text, state : Text, zip : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only realtors can add properties");
    };

    let property : Property = {
      id;
      address;
      city;
      state;
      zip;
      owner = caller;
      timestamp = Time.now();
    };

    properties.add(id, property);
  };

  public query ({ caller }) func getProperty(id : Text) : async Property {
    switch (properties.get(id)) {
      case (null) { Runtime.trap("Property not found") };
      case (?property) {
        // Realtors can only view their own properties, admins can view all
        if (property.owner != caller and not (AccessControl.isAdmin(accessControlState, caller))) {
          Runtime.trap("Unauthorized: Can only view your own properties");
        };
        property;
      };
    };
  };

  public query ({ caller }) func getAllProperties() : async [Property] {
    if (AccessControl.isAdmin(accessControlState, caller)) {
      properties.values().toArray();
    } else if (AccessControl.hasPermission(accessControlState, caller, #user)) {
      let allProperties = properties.values().toArray();
      allProperties.filter<Property>(func(p) { p.owner == caller });
    } else {
      Runtime.trap("Unauthorized: Only authenticated users can view properties");
    };
  };

  // Service Request Management
  public shared ({ caller }) func createServiceRequest(
    propertyId : Text,
    title : Text,
    description : Text,
    urgency : Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only realtors can create requests");
    };

    // Verify the property exists and belongs to the caller
    switch (properties.get(propertyId)) {
      case (null) { Runtime.trap("Property not found") };
      case (?property) {
        if (property.owner != caller) {
          Runtime.trap("Unauthorized: Can only create requests for your own properties");
        };
      };
    };

    let requestId = propertyId.concat(Time.now().toText());
    let request : ServiceRequest = {
      id = requestId;
      propertyId;
      title;
      description;
      urgency;
      status = "Pending";
      photos = [];
      createdBy = caller;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    serviceRequests.add(requestId, request);
    requestId;
  };

  public shared ({ caller }) func uploadPhoto(requestId : Text, blobId : Text) : async () {
    switch (serviceRequests.get(requestId)) {
      case (null) { Runtime.trap("Service Request not found") };
      case (?request) {
        // Only the creator or admin can upload photos
        if (request.createdBy != caller and not (AccessControl.isAdmin(accessControlState, caller))) {
          Runtime.trap("Unauthorized: Can only upload photos to your own requests");
        };

        let photosArray = request.photos;
        let newPhotosList = List.fromArray([blobId]);
        let combinedArray = if (photosArray.size() == 0) {
          [blobId];
        } else {
          [newPhotosList.toArray(), photosArray].flatten();
        };
        let updatedRequest : ServiceRequest = {
          id = request.id;
          propertyId = request.propertyId;
          title = request.title;
          description = request.description;
          urgency = request.urgency;
          status = request.status;
          photos = combinedArray;
          createdBy = request.createdBy;
          createdAt = request.createdAt;
          updatedAt = Time.now();
        };

        serviceRequests.add(requestId, updatedRequest);
      };
    };
  };

  public shared ({ caller }) func updateServiceRequestStatus(requestId : Text, newStatus : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update request status");
    };

    switch (serviceRequests.get(requestId)) {
      case (null) { Runtime.trap("Service Request not found") };
      case (?request) {
        let updatedRequest : ServiceRequest = {
          id = request.id;
          propertyId = request.propertyId;
          title = request.title;
          description = request.description;
          urgency = request.urgency;
          status = newStatus;
          photos = request.photos;
          createdBy = request.createdBy;
          createdAt = request.createdAt;
          updatedAt = Time.now();
        };

        serviceRequests.add(requestId, updatedRequest);
      };
    };
  };

  public query ({ caller }) func getServiceRequest(id : Text) : async ServiceRequest {
    switch (serviceRequests.get(id)) {
      case (null) { Runtime.trap("Service Request not found") };
      case (?request) {
        // Realtors can only view their own requests, admins can view all
        if (request.createdBy != caller and not (AccessControl.isAdmin(accessControlState, caller))) {
          Runtime.trap("Unauthorized: Can only view your own requests");
        };
        request;
      };
    };
  };

  public query ({ caller }) func getAllServiceRequests() : async [ServiceRequest] {
    if (AccessControl.isAdmin(accessControlState, caller)) {
      serviceRequests.values().toArray();
    } else if (AccessControl.hasPermission(accessControlState, caller, #user)) {
      let allRequests = serviceRequests.values().toArray();
      allRequests.filter<ServiceRequest>(func(r) { r.createdBy == caller });
    } else {
      Runtime.trap("Unauthorized: Only authenticated users can view service requests");
    };
  };

  // Contact Form Handling
  public shared ({ caller }) func submitContactForm(name : Text, email : Text, phone : Text, message : Text) : async Text {
    // Public access - anyone including guests can submit contact forms
    let formId = Time.now().toText();
    let form : ContactForm = {
      id = formId;
      name;
      email;
      phone;
      message;
      submittedAt = Time.now();
    };

    contactForms.add(formId, form);
    formId;
  };

  public query ({ caller }) func getContactForm(id : Text) : async ContactForm {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view contact forms");
    };

    switch (contactForms.get(id)) {
      case (null) { Runtime.trap("Contact Form not found") };
      case (?form) { form };
    };
  };

  public query ({ caller }) func getAllContactForms() : async [ContactForm] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view contact forms");
    };

    contactForms.values().toArray();
  };

  // Plans Management
  public query ({ caller }) func getAllPlans() : async [Plan] {
    plans.values().toArray();
  };

  public query ({ caller }) func getPlanById(planId : Text) : async Plan {
    switch (plans.get(planId)) {
      case (null) { Runtime.trap("Plan not found") };
      case (?plan) { plan };
    };
  };
};
