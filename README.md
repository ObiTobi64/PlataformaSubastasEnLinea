# ⚖ Plataforma de Subastas 

## Descripción

El sistema permite a los usuarios pujar por algun producto en subasta, incluso puede tener un chat en tiempo real con los demas pujadores. El sistema tambien incluye un historial, sección de resultados, y un panel de control para el administrador.

## 🎨 Características 

###  Funcionalidades 
- **Chat en tiempo real** - Se uso WebSocket para el tiempo real
- **Subastas en Tiempo Real** - Se uso WebSocket para las actualizaciones en tiempo real
- **Autenticación** - Login/Register con roles de admin y usuario
- **Gestión de Pujas** - Validación y procesamiento de pujas realizadas
- **Historial** - Ofertas y estadisticas realizados
- **Resultados Globales** - Estadísticas y rankings de subastas
- **Panel de Administración o de Control** - CRUD completo de subastas y usuarios 

### Experiencia de Usuario
- **Internacionalización** - i18n para el Español e Inglés 
- **Notificaciones** - Notificaciones sobre si una puja fue realizada
- **Temporizadores** - Tiempo restante en tiempo real
- **Estados de la subasta** - Visualización del estado de la subasta

### 🏗️ Arquitectura Técnica
- **Render Props** - Mayor flexibilidad en el renderizado
- **Compound Components** - Patrón para componentes reutilizables por ejemplo para los componentes de secundarios de la card .
- **Custom Hooks** - Lógica separada de lo visual
- **Validación** - Formik + Yup para formularios y cualquier otra validación necesaria
- **Estado Global** - Para un mejor manejo Zustand

## 🚀 Tecnologías

### Frontend
- **React 18** + **TypeScript**
- **Formik + Yup** - Formularios y validación
- **Material-UI** - Componentes y theming
- **Zustand** - Estado global
- **Socket.IO Client** - Comunicación en tiempo real
- **React Router Dom** - Navegación SPA
- **react-i18next** - Internacionalización
- **Vite** - Build tool y desarrollo

### Backend
- **Socket.IO Server** - WebSocket server para el tiempo real del chat y puja
- **Json-Server** - Servidor para el CRUD de los datos
- **Node.js + TypeScript** - Tipado de datos y runtime

### Herramientas
- **ESLint** - Linting de código
- **Axios** - Cliente HTTP
- **Error Boundary** - Manejo de errores

## 📁 Estructura del Proyecto

```
Subastas/                  # Aplicación React
├                  
│   ├── src/ 
|   |   ├── api/              # apis
│   │   │   ├── jsonInstance    #Llamada al .env direction
│   │   │  
│   │   ├── hooks/              # Custom Hooks
│   │   │   ├── useAuth.ts                 # Autenticación
│   │   │   ├── useAuction.ts              # Gestión de subastas
│   │   │   ├── useBidForm.ts              # Formulario de ofertas
│   │   │   ├── useBidHistory.ts           # Historial de usuario
│   │   │   └── useWebSocket.ts            # Socket.IO
│   │   ├── store/              # Estado Global (Zustand)
│   │   │   ├── useAuctionStore.ts         # Subastas
│   │   │   ├── useBidStore.ts             # Ofertas
│   │   │   └── useUserStore.ts            # Usuarios
│   │   ├── contexts/           # React Context
│   │   │   ├── AuthContext.tsx            # Autenticación
│   │   │   └── SnackbarContext.tsx        # Notificaciones
│   │   ├── services/           # API Services
│   │   │   ├── auctionService.ts          # CRUD subastas
│   │   │   ├── bidService.ts              # CRUD ofertas
│   │   │   └── userService.ts             # CRUD usuarios
|   |   ├── components/         # Componentes reutilizables
│   │   │   ├── AuctionCard.tsx            # Compound Component
│   │   │   ├── AuctionStateRenderer.tsx   # Render Props
│   │   │   ├── BidForm.tsx                # Formulario de ofertas
│   │   │   ├── Timer.tsx                  # Cronómetro
│   │   │   └── ...
│   │   ├── pages/              # Páginas principales
│   │   │   ├── Home.tsx                   # Listado de subastas
│   │   │   ├── auction/
│   │   │   │   ├── AuctionInfo.tsx        # Detalle de subasta
│   │   │   │   └── AuctionResults.tsx     # Resultados globales
│   │   │   ├── admin/
│   │   │   │   └── AdminPanel.tsx         # Panel administrativo
│   │   │   ├── user/
│   │   │   │   └── BidHistory.tsx         # Historial personal
│   │   │   └── auth/
│   │   │       ├── Login.tsx
│   │   │       └── Register.tsx
│   │   ├── interfaces/         # Tipos TypeScript
│   │   ├── i18n/              # Internacionalización
│   │   │   ├── en.ts
│   │   │   └── es.ts
│   │   ├── constants/         # Constantes
│   │   ├── guards/            # Protección de rutas
│   │   ├── layout/            # Layout components
|   |   |── websocket/             # Servidor WebSocket
|   |   ├   |── server.ts          # Server Principal
|   |   |   |── constants/ 
│   │   └── db.json            # Base de datos mock
└── README.md
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- **Node.js** 
- **npm** 

### 1. Clonar el repositorio
```bash
git clone https://github.com/ObiTobi64/PlataformaSubastasEnLinea.git
```

### 2. Instalar dependencias

**Frontend:**
```bash
npm install
```

**WebSocket Server:**
```bash
cd src
cd websocket
npm install
```

### 3. Ejecutar la aplicación

Necesitas **3 terminales** diferentes:

**Terminal 1 - JSON Server (Puerto 3000):**
```bash
npx json-server db.json
```

**Terminal 2 - WebSocket Server (Puerto 3001):**
```bash
cd src
cd websocket
npm run dev
```

**Terminal 3 - Frontend React (Puerto 5173):**
```bash
npm run dev
```

### 4. Acceder a la aplicación
- **API REST**: http://localhost:3000
- **WebSocket**: http://localhost:3001
- **Frontend**: http://localhost:5173

## 👥 Usuarios de Prueba

```javascript
// Admin
Username: admin
Role: admin

// Usuario común  
Username: user
Role: user
```

## 🎯 Funcionalidades Detalladas

### 🏠 Home - Listado de Subastas
- Visualización de todas las subastas disponibles
- Estados visuales: **Próxima**, **Activa**, **Finalizada**
- Cronómetros en tiempo real para subastas activas
- Información de precios base y ofertas actuales

### 🎪 Detalle de Subasta
- Información completa del producto
- Boton chat en subastas en curso, y chat en el lado izquierdo del producto
- Ofertas realizadas
- Monto minimo validacion
- Cronómetro dinámico según estado
- Información del ganador 
### 📈 Historial Personal
- **Estadísticas personales**: Total gastado, ofertas promedio, subastas ganadas
- **Lista completa** de ofertas realizadas
- **Información contextual** de cada subasta

### 📊 Panel de Administración
- **Gestión de Subastas**: CRUD completo con validaciones
- **Gestión de Usuarios**: CRUD de Usuarios
- **Estadísticas**: Estadisticas globales del sistema


### 🏆 Resultados Globales
- **Estadísticas del sistema**: Ingresos totales, participantes, subastas completadas
- **Ranking de usuarios**: Top oferentes por monto total
- **Historial de subastas**: Todas las subastas con ganadores

## 🔧 Patrones de Diseño Implementados

### 1. **Compound Components**
```tsx
AuctionCard.tsx:

const Title = ({ children }: { children: ReactNode }) => {
  return (
    <Typography
      gutterBottom
      variant="h6"
      component="div"
      sx={{
        textAlign: "center",
        fontWeight: "bold",
        mt: 1,
      }}
    >
      {children}
    </Typography>
  );
};

AuctionCard.ImageContainer = ImageContainer;
AuctionCard.Timer = Timer;
AuctionCard.Footer = Footer;
AuctionCard.Title = Title;
AuctionCard.Image = Image;

```

### 2. **Render Props**
```tsx
<AuctionStateRenderer auction={auction} timer={timer}>
      {(auction, state, timeInfo) => (
        <Box sx={{ p: 3 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Box
                component="img"
                src={auction.img || "https://picsum.photos/500"}
                alt={auction.name}
                sx={{
                  width: "100%",
                  height: 300,
                  objectFit: "contain",
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              />
            </Grid>
  .......
```

### 3. **Custom Hooks**
```tsx
const { timers, placeBid } = useAppWebSocket();
const { userBids, statistics, loading } = useBidHistory();
const { formik, bidError, minimumBid } = useBidForm();
```

## 🌐 Arquitectura en Tiempo Real

### WebSocket Server (`websocket/server.ts`)
```typescript
// Eventos principales
io.on("connection", (socket) => {
  // 1. Envío de estado inicial
  socket.emit("INITIAL_DATA", { timers });
  
  // 2. Manejo de ofertas
  socket.on("PLACE_BID", (bidData) => {
    // Validación + Broadcast
  });
  // 3. Chat message
  socket.on("JOIN_AUCTION_CHAT", (auctionId: string) => {
    socket.join(`auction_chat_${auctionId}`);
    socket.emit("CHAT_HISTORY", chatMessages[auctionId] || []);
  });

  socket.on(
    "SEND_CHAT_MESSAGE",
    (data: { auctionId: string; sender: string; content: string }) => {
      if (!data.content.trim()) return;

      const message: IChatMessage = {
        auctionId: data.auctionId,
        sender: data.sender,
        content: data.content,
        timestamp: new Date().toISOString(),
      };

      if (!chatMessages[data.auctionId]) chatMessages[data.auctionId] = [];
      chatMessages[data.auctionId].push(message);

      io.to(`auction_chat_${data.auctionId}`).emit("RECEIVE_CHAT_MESSAGE", message);
    }
  );
  
  // 4. Actualizaciones de cronómetro
  setInterval(() => {
    io.emit("UPDATE_DATA", { timers });
  }, 1000);
});
```
## 🛡️ Validaciones y Seguridad

### Frontend (Formik + Yup)
```typescript
const registerSchema = Yup.object({
  username: Yup.string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(30, "El nombre de usuario no puede exceder los 30 caracteres")
    .required("El nombre de usuario es requerido"),
  role: Yup.string()
    .oneOf(["user", "admin"], "Rol inválido")
    .required("El rol es requerido"),
  avatar: Yup.string().url("Debe ser una URL válida").optional(),
});

```

## 📱 Internacionalización

Soporte completo para **Español** e **Inglés**:

```typescript
const { t } = useTranslation();

{t("admin.username")}
{ t("bidHistory.amount") || "Amount"} 
{t("bidHistory.title")}    
{t("home.basePrice")}    
```


## 📊 Performance y Optimización

- **Context**: Manejo para el estado modular de Auth 
- **Zustand**: Estado global eficiente sin re-renders innecesarios
- **useMemo**: Cálculos costosos en validaciones
- **React.memo**: Componentes optimizados
- **Lazy Loading**: Carga condicional de componentes
- **WebSocket**: Solo procesa si hay clientes conectados

## 🚀 Scripts Disponibles

### Frontend
```bash
npm run dev        # Desarrollo con Vite
npm run build      # Build de producción
npm run lint       # ESLint
npm run preview    
```

### WebSocket
```bash
npm run dev       
```

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: ObiTobi64
- Email: obitotcp@gmail.com
---
