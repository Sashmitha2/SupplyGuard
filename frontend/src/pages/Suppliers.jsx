import { useEffect, useState } from "react";

import {
  getSuppliers,
  getSupplierRisk,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../services/api";

import RiskBadge from "../components/RiskBadge";
import CrudModal from "../components/CRUDModal";
import DeleteModal from "../components/DeleteModal";

function Suppliers() {

  // =========================
  // DATA
  // =========================

  const [suppliers, setSuppliers] =
    useState([]);

  // =========================
  // SEARCH + FILTER
  // =========================

  const [search, setSearch] =
    useState("");

  const [riskFilter, setRiskFilter] =
    useState("ALL");

  // =========================
  // ADD / EDIT
  // =========================

  const [showForm, setShowForm] =
    useState(false);

  const [editingSupplier, setEditingSupplier] =
    useState(null);

  // =========================
  // DELETE
  // =========================

  const [deletingSupplier, setDeletingSupplier] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);

  // =========================
  // LOADING / SAVING
  // =========================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  // =========================
  // FORM DATA
  // =========================

  const [formData, setFormData] =
    useState({
      supplierId: "",
      supplierName: "",
      country: "",
      leadTimeDays: "",
      reliabilityScore: "",
      riskLevel: "MEDIUM",
      materialsSupplied: "",
    });

  // =====================================================
  // LOAD SUPPLIERS
  // =====================================================

  const loadSuppliers = async () => {

    try {

      setLoading(true);
      setError("");

      const [supplierResponse, riskResponse] =
        await Promise.all([
          getSuppliers(),
          getSupplierRisk(),
        ]);

      const supplierData =
        supplierResponse.data;

      const riskData =
        riskResponse.data;

      const combinedSuppliers =
        supplierData.map(
          (supplier) => {

            const riskInfo =
              riskData.find(
                (risk) =>
                  risk.supplierId ===
                  supplier.supplierId
              );

            return {
              ...supplier,

              riskScore:
                riskInfo?.riskScore ?? 0,

              calculatedRiskLevel:
                riskInfo?.riskLevel ||
                supplier.riskLevel ||
                "LOW",

              activeDisruptions:
                riskInfo?.activeDisruptions ??
                0,
            };
          }
        );

      setSuppliers(
        combinedSuppliers
      );

    } catch (error) {

      console.error(error);

      setError(
        "Failed to load suppliers."
      );

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // LOAD WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    loadSuppliers();
  }, []);

  // =====================================================
  // HANDLE FORM INPUT
  // =====================================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  // =====================================================
  // OPEN ADD MODAL
  // =====================================================

  const handleAdd = () => {

    setEditingSupplier(null);

    setFormData({
      supplierId: "",
      supplierName: "",
      country: "",
      leadTimeDays: "",
      reliabilityScore: "",
      riskLevel: "MEDIUM",
      materialsSupplied: "",
    });

    setShowForm(true);
    setError("");
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const handleEdit = (supplier) => {

    setEditingSupplier(
      supplier
    );

    setFormData({
      supplierId:
        supplier.supplierId || "",

      supplierName:
        supplier.supplierName || "",

      country:
        supplier.country || "",

      leadTimeDays:
        supplier.leadTimeDays ?? "",

      reliabilityScore:
        supplier.reliabilityScore ?? "",

      riskLevel:
        supplier.riskLevel ||
        "MEDIUM",

      materialsSupplied:
        Array.isArray(
          supplier.materialsSupplied
        )
          ? supplier.materialsSupplied.join(
              ", "
            )
          : "",
    });

    setShowForm(true);
    setError("");
  };

  // =====================================================
  // SAVE SUPPLIER
  // =====================================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    try {

      setSaving(true);
      setError("");

      const data = {

        supplierId:
          formData.supplierId,

        supplierName:
          formData.supplierName,

        country:
          formData.country,

        leadTimeDays:
          Number(
            formData.leadTimeDays
          ),

        reliabilityScore:
          Number(
            formData.reliabilityScore
          ),

        riskLevel:
          formData.riskLevel,

        materialsSupplied:
          formData.materialsSupplied
            .split(",")
            .map(
              (item) =>
                item.trim()
            )
            .filter(Boolean),
      };

      // EDIT
      if (editingSupplier) {

        await updateSupplier(
          editingSupplier._id,
          data
        );

      }

      // ADD
      else {

        await createSupplier(
          data
        );

      }

      // Close modal
      setShowForm(false);

      setEditingSupplier(null);

      // Reload table
      await loadSuppliers();

    } catch (error) {

      console.error(error);

      if (
        error.response?.data?.message
      ) {

        setError(
          error.response.data.message
        );

      } else {

        setError(
          "Failed to save supplier."
        );

      }

    } finally {

      setSaving(false);

    }
  };

  // =====================================================
  // OPEN DELETE MODAL
  // =====================================================

  const handleDelete = (
    supplier
  ) => {

    setDeletingSupplier(
      supplier
    );
  };

  // =====================================================
  // CONFIRM DELETE
  // =====================================================

  const confirmDelete = async () => {

    if (!deletingSupplier) {
      return;
    }

    try {

      setDeleting(true);
      setError("");

      await deleteSupplier(
        deletingSupplier._id
      );

      // Close delete modal
      setDeletingSupplier(null);

      // Reload table
      await loadSuppliers();

    } catch (error) {

      console.error(error);

      if (
        error.response?.data?.message
      ) {

        setError(
          error.response.data.message
        );

      } else {

        setError(
          "Failed to delete supplier."
        );

      }

    } finally {

      setDeleting(false);

    }
  };

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredSuppliers =
    suppliers.filter(
      (supplier) => {

        const searchText =
          search.toLowerCase();

        const matchesSearch =
          supplier.supplierName
            ?.toLowerCase()
            .includes(
              searchText
            ) ||

          supplier.supplierId
            ?.toLowerCase()
            .includes(
              searchText
            ) ||

          supplier.country
            ?.toLowerCase()
            .includes(
              searchText
            );

        const matchesRisk =
          riskFilter === "ALL" ||
          supplier.calculatedRiskLevel ===
            riskFilter;

        return (
          matchesSearch &&
          matchesRisk
        );
      }
    );

  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="page">

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showForm && (

        <CrudModal

          title={
            editingSupplier
              ? "Edit Supplier"
              : "Add New Supplier"
          }

          onClose={() => {

            setShowForm(false);

            setEditingSupplier(
              null
            );

          }}

          onSubmit={
            handleSubmit
          }

          submitText={
            editingSupplier
              ? "Update Supplier"
              : "Create Supplier"
          }

          saving={saving}
        >

          <div className="form-grid">

            {/* SUPPLIER ID */}

            <div className="form-group">

              <label>
                Supplier ID
              </label>

              <input
                type="text"
                name="supplierId"
                value={
                  formData.supplierId
                }
                onChange={
                  handleChange
                }
                placeholder="e.g. SUP101"
                required
                disabled={
                  Boolean(
                    editingSupplier
                  )
                }
              />

            </div>

            {/* SUPPLIER NAME */}

            <div className="form-group">

              <label>
                Supplier Name
              </label>

              <input
                type="text"
                name="supplierName"
                value={
                  formData.supplierName
                }
                onChange={
                  handleChange
                }
                placeholder="Supplier name"
                required
              />

            </div>

            {/* COUNTRY */}

            <div className="form-group">

              <label>
                Country
              </label>

              <input
                type="text"
                name="country"
                value={
                  formData.country
                }
                onChange={
                  handleChange
                }
                placeholder="e.g. Sri Lanka"
                required
              />

            </div>

            {/* LEAD TIME */}

            <div className="form-group">

              <label>
                Lead Time (Days)
              </label>

              <input
                type="number"
                name="leadTimeDays"
                value={
                  formData.leadTimeDays
                }
                onChange={
                  handleChange
                }
                min="0"
                required
              />

            </div>

            {/* RELIABILITY */}

            <div className="form-group">

              <label>
                Reliability Score
              </label>

              <input
                type="number"
                name="reliabilityScore"
                value={
                  formData.reliabilityScore
                }
                onChange={
                  handleChange
                }
                min="0"
                max="100"
                required
              />

            </div>

            {/* RISK LEVEL */}

            <div className="form-group">

              <label>
                Risk Level
              </label>

              <select
                name="riskLevel"
                value={
                  formData.riskLevel
                }
                onChange={
                  handleChange
                }
                required
              >

                <option value="LOW">
                  LOW
                </option>

                <option value="MEDIUM">
                  MEDIUM
                </option>

                <option value="HIGH">
                  HIGH
                </option>

                <option value="CRITICAL">
                  CRITICAL
                </option>

              </select>

            </div>

            {/* MATERIALS */}

            <div className="form-group">

              <label>
                Materials Supplied
              </label>

              <input
                type="text"
                name="materialsSupplied"
                value={
                  formData.materialsSupplied
                }
                onChange={
                  handleChange
                }
                placeholder="MAT001, MAT002, MAT003"
              />

            </div>

          </div>

        </CrudModal>

      )}

      {/* =================================================
          DELETE CONFIRMATION MODAL
      ================================================= */}

      {deletingSupplier && (

        <DeleteModal

          itemName={
            deletingSupplier.supplierName
          }

          onCancel={() =>
            setDeletingSupplier(
              null
            )
          }

          onConfirm={
            confirmDelete
          }

          deleting={deleting}

        />

      )}

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="page-header">

        <div>

          <h1>
            Suppliers
          </h1>

          <p>
            Manage suppliers and
            monitor supplier risk.
          </p>

        </div>

        <button
          className="primary-button"
          onClick={handleAdd}
        >
          + Add Supplier
        </button>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="error-message">
          {error}
        </div>

      )}

      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

      <div className="filter-bar">

        <input
          type="text"
          placeholder="Search suppliers..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          className="search-input"
        />

        <select
          value={riskFilter}
          onChange={(event) =>
            setRiskFilter(
              event.target.value
            )
          }
          className="filter-select"
        >

          <option value="ALL">
            All Risk Levels
          </option>

          <option value="LOW">
            LOW
          </option>

          <option value="MEDIUM">
            MEDIUM
          </option>

          <option value="HIGH">
            HIGH
          </option>

          <option value="CRITICAL">
            CRITICAL
          </option>

        </select>

      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="table-card">

        {loading ? (

          <div className="loading">
            Loading suppliers...
          </div>

        ) : filteredSuppliers.length ===
          0 ? (

          <div className="empty-state">
            No suppliers found.
          </div>

        ) : (

          <div className="table-container">

            <table>

              <thead>

                <tr>

                  <th>
                    Supplier
                  </th>

                  <th>
                    Country
                  </th>

                  <th>
                    Reliability
                  </th>

                  <th>
                    Lead Time
                  </th>

                  <th>
                    Disruptions
                  </th>

                  <th>
                    Risk Score
                  </th>

                  <th>
                    Risk Level
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredSuppliers.map(
                  (supplier) => (

                    <tr
                      key={
                        supplier._id
                      }
                    >

                      <td>

                        <strong>
                          {
                            supplier.supplierName
                          }
                        </strong>

                        <br />

                        <small>
                          {
                            supplier.supplierId
                          }
                        </small>

                      </td>

                      <td>
                        {
                          supplier.country
                        }
                      </td>

                      <td>
                        {
                          supplier.reliabilityScore
                        }
                      </td>

                      <td>
                        {
                          supplier.leadTimeDays
                        }{" "}
                        days
                      </td>

                      <td>
                        {
                          supplier.activeDisruptions ??
                          0
                        }
                      </td>

                      <td>
                        {
                          supplier.riskScore ??
                          0
                        }
                      </td>

                      <td>

                        <RiskBadge
                          level={
                            supplier.calculatedRiskLevel
                          }
                        />

                      </td>

                      <td>

                        <div className="action-buttons">

                          <button
                            className="edit-button"
                            onClick={() =>
                              handleEdit(
                                supplier
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-button"
                            onClick={() =>
                              handleDelete(
                                supplier
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );
}

export default Suppliers;