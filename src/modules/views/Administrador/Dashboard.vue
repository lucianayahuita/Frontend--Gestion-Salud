<template>
  <div class="dashboard-container">
        <div class="header-dashboard">
            <p class="dashboard-title">Dashboard</p>
       
            <div class ="admin-box">
                Admin: {{NombreAdmin}}
              </div>             
         </div> 

             <div class="titulo">
                <p class= dashboard-title2>Resumen general del sistema</p>
            </div>
                <div class="cards">
                    <div class="card medico">
                        <p class="numero">{{stats.medicosActivos}}</p>
                        <p>Médicos Activos</p>
                    </div>
                    <div class="card admin-activos">
                        <p class="numero">{{stats.adminActivos}}</p>
                        <p>Administradores Activos</p>
                    </div>
                    <div class="card farmaceuticos">
                        <p class="numero">{{stats.farmaceuticosActivos}}</p>
                        <p>Farmacéuticos Activos</p>
                    </div>
                    <div class="card admin-inactivos">
                        <p class="numero">{{stats.adminInactivos}}</p>
                        <p>Administradores Inactivos</p>
                    </div>
                </div>
                     <div class="bottom-section">

                        <div class="recent-users">
                             <h3>Usuarios Recientemente Registrados</h3>

                          <div class="user-list">
                            <div class="user-item" v-for="user in users" :key="user.id">

                                 <div class="user-info">
                                     <p class="name">{{ user.name }}</p>
                                     <p class="role">{{ user.role }}</p>
                                 </div>

                            <span class="status" :class="user.active ? 'active' : 'inactive'">
                             {{ user.active ? 'Activo' : 'Inactivo' }}
                             </span>

                             </div>
                        </div>
                 </div>

                 <div class="acciones-rapidas">
                    <h3>Acciones rápidas</h3>

                     <button class="btn green">Registrar médico</button>
                     <button class="btn green-light">Registrar paciente</button>
                     <button class="btn green">Registrar administrador</button>
                     <button class="btn green-light">Registrar farmacéutico</button>

                 </div>

    </div>
    </div>
</template>

    <script setup>
        import { ref, onMounted } from 'vue'

            const NombreAdmin = ref('Cargando...')

            const stats = ref({
                medicosActivos: 0,
                adminActivos: 0,
                adminInactivos: 0,
                farmaceuticosActivos: 0
            })

            const users = ref([])

            const loading = ref(false)


            const fetchDashboardData = async () => {
                 loading.value = true

             try {
    

                 //  TEMPORAL 
                 const data = await new Promise((resolve) => {
                  setTimeout(() => {
                  resolve({
                     admin: "Admin1",
                     stats: {
                     medicosActivos: 24,
                     adminActivos: 5,
                     adminInactivos: 2,
                    farmaceuticosActivos: 7
                },
          users: [
            { id: 1, name: "Lucía Pérez", role: "Paciente", active: true },
            { id: 2, name: "Dr. Juan Soto", role: "Médico", active: true },
            { id: 3, name: "Ana Rojas", role: "Admin", active: false }
          ]
        })
      }, 500)
    })

   
    NombreAdmin.value = data.admin
    stats.value = data.stats
    users.value = data.users

         } catch (error) {
            console.error("Error cargando dashboard:", error)
         } finally {
          loading.value = false
         }
    }

        onMounted(() => {
        fetchDashboardData()
    })
</script>

        <style scoped>
            .dashboard-container {
            padding: 20px;
            font-family: var(--font-work);
            }

            .header-dashboard {
             display: flex;
             justify-content: space-between;
             align-items: center;
             margin-bottom: 20px;
             margin-left: 3%;
            }
            
            .dashboard-title {
             font-size: 26px;
             font-weight: 850;
             color: var(--secondary-color);
            }

            .dashboard-title2 {
            font-size: 23px;
            font-weight: 650;
            color: #7b53bc;
            margin-left: 3%;
            }

            .admin-box {
            border: 1px solid var(--secondary-color);
            padding: 10px 14px;
            border-radius: 9999px;
            background: var(--secondary-color);
            color: white;
            font-weight: 600;
            min-width: 160px;
            text-align: center;
            box-shadow: 0 2px 6px rgba(0,0,0,0.05);
           }

           .cards {
             display: grid;
             grid-template-columns: repeat(4, minmax(180px, 1fr));
             gap: 15px;
             margin-top: 20px;
             margin-left: 2%;
            }

            .card {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 140px;
            border-radius: 50px;
            padding: 15px;
            border: 2px solid #7cbf9b;
            text-align: center;
            }

            
            .medico {
                 background: #e9f7f1;
                 border: 2px solid #2f6f55;
                }
            .admin-activos {
                 background: #f3e9ff;
                border: 2px solid #5a3b8c;
             }
            .admin-inactivos { 
                background: #f3e9ff; 
                border: 2px solid #5a3b8c;}
            .farmaceuticos { 
                background: #e9f7f1;
                border: 2px solid #2f6f55;
             }

            .numero {
             font-size: 2rem;
             font-weight: 900;
             line-height: 1;
             margin-bottom: 6px;
            }

            .card p:last-child {
            font-size: 15px;
            font-weight: 600;
            }

      
            .bottom-section {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 20px;
            margin-top: 25px;
            margin-left: 2%;
            }

          
            .recent-users {
            border: 2px solid #2f6f55;
            border-radius: 20px;
            padding: 14px;
            background: white;
            }

            
            .recent-users h3 {
            color: var(--secondary-color);
            font-weight: 800;
            font-size: 16px;
            margin-bottom: 12px;
            }

            
            .user-list {
            display: flex;
            flex-direction: column;
            }

           
            .user-item {
            display: flex;
            justify-content: space-between;
            align-items: center;

            padding: 10px 8px;
            border-bottom: 1px solid rgba(47, 111, 85, 0.4);

            transition: 0.2s;
            }

            .user-item:last-child {
            border-bottom: none;
            }

            .user-item:hover {
            background: #eef7f2;
            }

           
            .name {
            font-weight: 700;
            color: #111;
            font-size: 14px;
            }

            
            .role {
            font-size: 12px;
            color: #5a3b8c;
            font-weight: 600;
            }

            
            .status {
            font-size: 11px;
            font-weight: 700;

            display: flex;
            align-items: center;
            justify-content: center;

            min-width: 75px;
            height: 26px;

            border-radius: 999px;
            }

            
            .status.active {
            background: #d1fae5;
            color: #065f46;
            }

            .status.inactive {
            background: #fee2e2;
            color: #991b1b;
            }

           
            .acciones-rapidas {
            border: 2px solid #2f6f55; 
            border-radius: 20px;
            padding: 15px;
            background: white;

            display: flex;
            flex-direction: column;
            gap: 12px;
            }

           
            .acciones-rapidas h3 {
            color: var(--secondary-color);
            font-weight: 800;
            font-size: 16px;
            margin-bottom: 5px;
            }

           
            .btn {
            padding: 12px;
            border-radius: 12px;
            border: 1px solid #2f6f55;

            font-weight: 600;
            cursor: pointer;

            text-align: center;

            transition: 0.2s;
            }

            .green {
            background: #d1fae5;
            }

            .green-light {
            background: #ecfdf5;
            }

           
            .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0,0,0,0.08);
            }

            </style>