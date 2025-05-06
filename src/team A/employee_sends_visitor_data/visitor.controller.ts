// import {
//   Controller,
//   Post,
//   Body,
//   UploadedFiles,
//   UseInterceptors,
//   BadRequestException,
//   Get,
//   Param,
//   Patch,
//   Delete,
//   NotFoundException,
// } from '@nestjs/common';
// import { FileFieldsInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { VisitorService } from './visitor.service';
// import { CreateVisitorDto } from './CreateVisitor.dto';
// import { extname } from 'path';
// import { Visitor } from './visitor.entity';

// @Controller('visitors')
// export class VisitorController {
//   constructor(private readonly visitorService: VisitorService) {}

//   @Post()
//   @UseInterceptors(
//     FileFieldsInterceptor([
//       { name: 'photoFile', maxCount: 1 },
//       { name: 'driverPhotoFile', maxCount: 1 },
//     ], {
//       storage: diskStorage({
//         destination: './src/uploads',
//         filename: (req, file, cb) => {
//           const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//           const prefix = file.fieldname === 'photoFile' ? 'photo' : 'driverphoto';
//           cb(null, `${prefix}-${uniqueSuffix}${extname(file.originalname)}`);
//         },
//       }),
//       fileFilter: (req, file, cb) => {
//         if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//           return cb(new Error('Only .jpg, .jpeg, .png files are allowed'), false);
//         }
//         cb(null, true);
//       },
//     }),
//   )
//   async create(
//     @Body() body: any,
//     @UploadedFiles() files: { photoFile?: Express.Multer.File[]; driverPhotoFile?: Express.Multer.File[] },
//   ) {
//     console.log('Received body:', body);
//     console.log('Received files:', {
//       photoFile: files.photoFile?.map(f => f.filename),
//       driverPhotoFile: files.driverPhotoFile?.map(f => f.filename),
//     });

//     const visitorData: CreateVisitorDto = {
//       firstname: body.firstname,
//       lastname: body.lastname,
//       gender: body.gender,
//       contactnumber: body.contactnumber,
//       email: body.email,
//       date: body.date,
//       time: body.time,
//       nationalid: body.nationalid,
//       photo: files.photoFile && files.photoFile[0] ? files.photoFile[0].filename : undefined,
//       visit: body.visit,
//       personname: body.personname,
//       department: body.department,
//       durationtime: body.durationtime,
//       durationunit: body.durationunit,
//       visitortype: body.visitortype,
//       vehicletype: body.vehicletype,
//       vehiclenumber: body.vehiclenumber,
//       drivername: body.drivername,
//       drivermobile: body.drivermobile,
//       drivernationalid: body.drivernationalid,
//       driverphoto: files.driverPhotoFile && files.driverPhotoFile[0] ? files.driverPhotoFile[0].filename : undefined,
//       notes: body.notes,
//     };

//     console.log('Mapped DTO:', visitorData);

//     if (!visitorData.firstname || !visitorData.email || !visitorData.photo) {
//       throw new BadRequestException('Firstname, email, and photo are required');
//     }

//     return this.visitorService.create(visitorData);
//   }

//   @Get()
//   async findAll() {
//     return this.visitorService.findAll();
//   }

//   @Get(':id')
//   async findOne(@Param('id') id: number) {
//     return this.visitorService.findOne(id);
//   }

//   @Patch(':id')
//   @UseInterceptors(
//     FileFieldsInterceptor([
//       { name: 'photoFile', maxCount: 1 },
//       { name: 'driverPhotoFile', maxCount: 1 },
//     ], {
//       storage: diskStorage({
//         destination: './src/uploads',
//         filename: (req, file, cb) => {
//           const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//           const prefix = file.fieldname === 'photoFile' ? 'photo' : 'driverphoto';
//           const originalName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '-');
//           cb(null, `${prefix}-${uniqueSuffix}-${originalName}`);
//         },
//       }),
//       fileFilter: (req, file, cb) => {
//         if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//           return cb(new Error('Only .jpg, .jpeg, .png files are allowed'), false);
//         }
//         cb(null, true);
//       },
//       limits: {
//         fileSize: 5 * 1024 * 1024, // 5MB limit
//       },
//     }),
//   )
//   async update(
//     @Param('id') id: number,
//     @Body() body: Partial<CreateVisitorDto>,
//     @UploadedFiles() files: { photoFile?: Express.Multer.File[]; driverPhotoFile?: Express.Multer.File[] },
//   ) {
//     console.log('Received body for PATCH:', body);
//     console.log('Received files for PATCH:', {
//       photoFile: files.photoFile?.map(f => f.filename),
//       driverPhotoFile: files.driverPhotoFile?.map(f => f.filename),
//     });

//     // Fetch existing visitor to preserve photo/driverphoto
//     const existingVisitor = await this.visitorService.findOne(id);

//     const visitorData: Partial<CreateVisitorDto> = {
//       ...body,
//       photo: files.photoFile && files.photoFile[0] ? files.photoFile[0].filename : body.photo || existingVisitor.photo,
//       driverphoto: files.driverPhotoFile && files.driverPhotoFile[0] ? files.driverPhotoFile[0].filename : (body.driverphoto || ((body as any).driverToggle === 'true' ? existingVisitor.driverphoto : undefined)),
//     };

//     console.log('Mapped DTO for PATCH:', visitorData);

//     // Relax validation to allow updates with existing data
//     if (!Object.keys(body).length && !files.photoFile && !files.driverPhotoFile) {
//       throw new BadRequestException('At least one field must be provided for update');
//     }

//     return this.visitorService.update(id, visitorData);
//   }

//   @Delete(':id')
//   async remove(@Param('id') id: number) {
//     return this.visitorService.remove(id);
//   }



//   @Get('nationalid/:nationalid')
//   async findByNationalId(@Param('nationalid') nationalid: string): Promise<Visitor> {
//     try {
//       return await this.visitorService.findByNationalId(nationalid);
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error;
//       }
//       throw new NotFoundException(`Failed to fetch visitor with national ID ${nationalid}`);
//     }
//   }
// }








// import {
//   Controller,
//   Post,
//   Body,
//   UploadedFiles,
//   UseInterceptors,
//   BadRequestException,
//   Get,
//   Param,
//   Patch,
//   Delete,
//   NotFoundException,
// } from '@nestjs/common';
// import { FileFieldsInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { VisitorService } from './visitor.service';
// import { CreateVisitorDto } from './CreateVisitor.dto';
// import { extname } from 'path';
// import { Visitor } from './visitor.entity';

// @Controller('visitors')
// export class VisitorController {
//   constructor(private readonly visitorService: VisitorService) {}

//   @Post()
//   @UseInterceptors(
//     FileFieldsInterceptor([
//       { name: 'photoFile', maxCount: 1 },
//       { name: 'driverPhotoFile', maxCount: 1 },
//     ], {
//       storage: diskStorage({
//         destination: './src/uploads',
//         filename: (req, file, cb) => {
//           const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//           const prefix = file.fieldname === 'photoFile' ? 'photo' : 'driverphoto';
//           cb(null, `${prefix}-${uniqueSuffix}${extname(file.originalname)}`);
//         },
//       }),
//       fileFilter: (req, file, cb) => {
//         if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//           return cb(new Error('Only .jpg, .jpeg, .png files are allowed'), false);
//         }
//         cb(null, true);
//       },
//     }),
//   )
//   async create(
//     @Body() body: any,
//     @UploadedFiles() files: { photoFile?: Express.Multer.File[]; driverPhotoFile?: Express.Multer.File[] },
//   ) {
//     console.log('Received body:', body);
//     console.log('Received files:', {
//       photoFile: files.photoFile?.map(f => f.filename),
//       driverPhotoFile: files.driverPhotoFile?.map(f => f.filename),
//     });

//     const visitorData: CreateVisitorDto = {
//       firstname: body.firstname,
//       lastname: body.lastname,
//       gender: body.gender,
//       contactnumber: body.contactnumber,
//       email: body.email,
//       date: body.date,
//       time: body.time,
//       nationalid: body.nationalid,
//       photo: files.photoFile && files.photoFile[0] ? files.photoFile[0].filename : body.photo,
//       visit: body.visit,
//       personname: body.personname,
//       department: body.department,
//       durationtime: body.durationtime,
//       durationunit: body.durationunit,
//       visitortype: body.visitortype,
//       vehicletype: body.vehicletype,
//       vehiclenumber: body.vehiclenumber,
//       drivername: body.drivername,
//       drivermobile: body.drivermobile,
//       drivernationalid: body.drivernationalid,
//       driverphoto: files.driverPhotoFile && files.driverPhotoFile[0] ? files.driverPhotoFile[0].filename : body.driverphoto,
//       notes: body.notes,
//     };

//     console.log('Mapped DTO:', visitorData);

//     // Validate required fields, allowing body.photo as a fallback
//     if (!visitorData.firstname || visitorData.firstname.trim() === '') {
//       throw new BadRequestException('Firstname is required');
//     }
//     if (!visitorData.email || visitorData.email.trim() === '') {
//       throw new BadRequestException('Email is required');
//     }
//     if (!visitorData.photo || visitorData.photo.trim() === '') {
//       throw new BadRequestException('Photo is required');
//     }

//     return this.visitorService.create(visitorData);
//   }

//   @Get()
//   async findAll() {
//     return this.visitorService.findAll();
//   }

//   @Get(':id')
//   async findOne(@Param('id') id: number) {
//     return this.visitorService.findOne(id);
//   }

//   @Patch(':id')
//   @UseInterceptors(
//     FileFieldsInterceptor([
//       { name: 'photoFile', maxCount: 1 },
//       { name: 'driverPhotoFile', maxCount: 1 },
//     ], {
//       storage: diskStorage({
//         destination: './src/uploads',
//         filename: (req, file, cb) => {
//           const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//           const prefix = file.fieldname === 'photoFile' ? 'photo' : 'driverphoto';
//           const originalName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '-');
//           cb(null, `${prefix}-${uniqueSuffix}-${originalName}`);
//         },
//       }),
//       fileFilter: (req, file, cb) => {
//         if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//           return cb(new Error('Only .jpg, .jpeg, .png files are allowed'), false);
//         }
//         cb(null, true);
//       },
//       limits: {
//         fileSize: 5 * 1024 * 1024, // 5MB limit
//       },
//     }),
//   )
//   async update(
//     @Param('id') id: number,
//     @Body() body: Partial<CreateVisitorDto>,
//     @UploadedFiles() files: { photoFile?: Express.Multer.File[]; driverPhotoFile?: Express.Multer.File[] },
//   ) {
//     console.log('Received body for PATCH:', body);
//     console.log('Received files for PATCH:', {
//       photoFile: files.photoFile?.map(f => f.filename),
//       driverPhotoFile: files.driverPhotoFile?.map(f => f.filename),
//     });

//     const existingVisitor = await this.visitorService.findOne(id);

//     const visitorData: Partial<CreateVisitorDto> = {
//       ...body,
//       photo: files.photoFile && files.photoFile[0] ? files.photoFile[0].filename : body.photo || existingVisitor.photo,
//       driverphoto: files.driverPhotoFile && files.driverPhotoFile[0] ? files.driverPhotoFile[0].filename : (body.driverphoto || ((body as any).driverToggle === 'true' ? existingVisitor.driverphoto : undefined)),
//     };

//     console.log('Mapped DTO for PATCH:', visitorData);

//     if (!Object.keys(body).length && !files.photoFile && !files.driverPhotoFile) {
//       throw new BadRequestException('At least one field must be provided for update');
//     }

//     return this.visitorService.update(id, visitorData);
//   }

//   @Delete(':id')
//   async remove(@Param('id') id: number) {
//     return this.visitorService.remove(id);
//   }

//   @Get('nationalid/:nationalid')
//   async findByNationalId(@Param('nationalid') nationalid: string): Promise<Visitor> {
//     try {
//       return await this.visitorService.findByNationalId(nationalid);
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error;
//       }
//       throw new NotFoundException(`Failed to fetch visitor with national ID ${nationalid}`);
//     }
//   }
// }












import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  Get,
  Param,
  Patch,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { VisitorService } from './visitor.service';
import { CreateVisitorDto } from './CreateVisitor.dto';
import { extname } from 'path';
import { Visitor } from './visitor.entity';

@Controller('visitors')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photoFile', maxCount: 1 },
      { name: 'driverPhotoFile', maxCount: 1 },
    ], {
      storage: diskStorage({
        destination: './src/uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const prefix = file.fieldname === 'photoFile' ? 'photo' : 'driverphoto';
          cb(null, `${prefix}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error('Only .jpg, .jpeg, .png files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async create(
    @Body() body: any,
    @UploadedFiles() files: { photoFile?: Express.Multer.File[]; driverPhotoFile?: Express.Multer.File[] },
  ) {
    console.log('Received body (raw):', body);
    // Handle case sensitivity by checking both firstname and Firstname
    const firstname = body.firstname || body.Firstname || '';

    console.log('Received files:', {
      photoFile: files.photoFile?.map(f => f.filename),
      driverPhotoFile: files.driverPhotoFile?.map(f => f.filename),
    });

    const visitorData: CreateVisitorDto = {
      firstname: firstname,
      lastname: body.lastname,
      gender: body.gender,
      contactnumber: body.contactnumber,
      email: body.email,
      date: body.date,
      time: body.time,
      nationalid: body.nationalid,
      photo: files.photoFile && files.photoFile[0] ? files.photoFile[0].filename : body.photo,
      visit: body.visit,
      personname: body.personname,
      department: body.department,
      durationtime: body.durationtime,
      durationunit: body.durationunit,
      visitortype: body.visitortype,
      vehicletype: body.vehicletype,
      vehiclenumber: body.vehiclenumber,
      drivername: body.drivername,
      drivermobile: body.drivermobile,
      drivernationalid: body.drivernationalid,
      driverphoto: files.driverPhotoFile && files.driverPhotoFile[0] ? files.driverPhotoFile[0].filename : body.driverphoto,
      notes: body.notes,
    };

    console.log('Mapped DTO:', visitorData);

    if (!visitorData.firstname || visitorData.firstname.trim() === '') {
      throw new BadRequestException('Firstname is required');
    }
    if (!visitorData.email || visitorData.email.trim() === '') {
      throw new BadRequestException('Email is required');
    }
    if (!visitorData.photo || visitorData.photo.trim() === '') {
      throw new BadRequestException('Photo is required');
    }

    return this.visitorService.create(visitorData);
  }

  @Get()
  async findAll() {
    return this.visitorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.visitorService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photoFile', maxCount: 1 },
      { name: 'driverPhotoFile', maxCount: 1 },
    ], {
      storage: diskStorage({
        destination: './src/uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const prefix = file.fieldname === 'photoFile' ? 'photo' : 'driverphoto';
          const originalName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '-');
          cb(null, `${prefix}-${uniqueSuffix}-${originalName}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error('Only .jpg, .jpeg, .png files are allowed'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  async update(
    @Param('id') id: number,
    @Body() body: Partial<CreateVisitorDto>,
    @UploadedFiles() files: { photoFile?: Express.Multer.File[]; driverPhotoFile?: Express.Multer.File[] },
  ) {
    console.log('Received body for PATCH:', body);
    console.log('Received files for PATCH:', {
      photoFile: files.photoFile?.map(f => f.filename),
      driverPhotoFile: files.driverPhotoFile?.map(f => f.filename),
    });

    const existingVisitor = await this.visitorService.findOne(id);

    const visitorData: Partial<CreateVisitorDto> = {
      ...body,
      photo: files.photoFile && files.photoFile[0] ? files.photoFile[0].filename : body.photo || existingVisitor.photo,
      driverphoto: files.driverPhotoFile && files.driverPhotoFile[0] ? files.driverPhotoFile[0].filename : (body.driverphoto || ((body as any).driverToggle === 'true' ? existingVisitor.driverphoto : undefined)),
    };

    console.log('Mapped DTO for PATCH:', visitorData);

    if (!Object.keys(body).length && !files.photoFile && !files.driverPhotoFile) {
      throw new BadRequestException('At least one field must be provided for update');
    }

    return this.visitorService.update(id, visitorData);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.visitorService.remove(id);
  }

  @Get('nationalid/:nationalid')
  async findByNationalId(@Param('nationalid') nationalid: string): Promise<Visitor> {
    try {
      return await this.visitorService.findByNationalId(nationalid);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Failed to fetch visitor with national ID ${nationalid}`);
    }
  }
}