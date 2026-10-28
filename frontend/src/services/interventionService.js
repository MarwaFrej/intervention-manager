import api from "./api";

export const getInterventions = async ({
  page = 0,
  size = 10,
  search = "",
  status = "",
} = {}) => {
  const params = {
    page,
    size,
  };

  if (search.trim()) {
    params.search = search.trim();
  }

  if (status) {
    params.status = status;
  }

  const response = await api.get("/interventions", { params });

  return response.data;
};

export const getIntervention = async (id) => {
  const response = await api.get(`/interventions/${id}`);

  return response.data;
};

export const createIntervention = async (data) => {
  const response = await api.post("/interventions", data);

  return response.data;
};

export const updateIntervention = async (id, data) => {
  const response = await api.put(`/interventions/${id}`, data);

  return response.data;
};

export const updateInterventionStatus = async (id, status) => {
  const response = await api.patch(`/interventions/${id}/status`, {
    status,
  });

  return response.data;
};

export const assignTechnician = async (id, technicianId) => {
  const response = await api.patch(
    `/interventions/${id}/assign/${technicianId}`,
  );

  return response.data;
};

export const getInterventionHistory = async (id) => {
  const response = await api.get(`/interventions/${id}/history`);

  return response.data;
};

export const getPlanningInterventions = async (start, end) => {
  const response = await api.get("/interventions/planning", {
    params: { start, end },
  });

  return response.data;
};

export const getMapInterventions = async (filters = {}) => {
  const params = {};

  if (filters.status) params.status = filters.status;
  if (filters.technicianId) {
    params.technicianId = filters.technicianId;
  }
  if (filters.start) params.start = filters.start;
  if (filters.end) params.end = filters.end;

  const response = await api.get("/interventions/map", { params });
  return response.data;
};


