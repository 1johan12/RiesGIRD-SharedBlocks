import { defineStore } from "pinia";
import router from "@/router";
import type { User, ResponseAuthLogin } from "@/types/auth";
import { ref, computed } from "vue";
import HttpClient from "@/helpers/http-client"; 

export const useAuthStore = defineStore("auth_store", () => {
  
  
  
  const user = ref<User | null>(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "") : null
  );

  
  const academicUnitId = computed(() => {
    if (user.value?.academic_unit_id) {
      return Number(user.value.academic_unit_id);
    }
    const storedId = localStorage.getItem("academic_unit_id");
    if (storedId && storedId !== "undefined" && storedId !== "null") {
      return parseInt(storedId);
    }
    return 1;
  });

  const isAuthenticated = () => user.value != null;

  

  /**
   * Guarda los datos del perfil del administrador locales
   */
  const saveSession = (newUser: User) => {
    localStorage.setItem("user", JSON.stringify(newUser));
    
    if (newUser.academic_unit_id) {
      localStorage.setItem("academic_unit_id", String(newUser.academic_unit_id));
    }

    user.value = newUser;
    
  };

  /**
   * Limpia la sesión local y le avisa a Laravel para destruir la cookie
   */
  const removeSession = async () => {
    try {
      
      await HttpClient.post("auth/logout");
    } catch (error) {
      console.error("Error destruyendo cookie en backend:", error);
    } finally {
      
      user.value = null;
      localStorage.removeItem("user");
      localStorage.removeItem("academic_unit_id");
      
      setTimeout(() => {
        router.push("auth/sign-in");
      }, 25);
    }
  };

  /**
   * Validación de permisos en tiempo real para Vue Router y directivas
   */
  const isPermitedRoute = (permission: string) => {
    const USER = user.value;
    if (USER && USER.role?.name !== "Super-Admin") {
      const permissions = USER.permissions;
      if (permissions?.includes(permission) || permission === "all") {
        return true;
      } else {
        return false;
      }
    }
    return true; 
  };

  return {
    user,
    academicUnitId,
    saveSession,
    removeSession,
    isAuthenticated,
    isPermitedRoute,
  };
});